const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Cart = require("../models/cart");
const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

const { orderValidation } = require("../validationSchema");
const sendEmail = require("../services/sendEmails");
const {
  orderPlacedTemplate,

  shippedTemplate,

  outForDeliveryTemplate,

  deliveredTemplate,

  adminOrderTemplate,
} = require("../services/emailTemplates");

const generateInvoice = require("../utils/generateInvoice");

const sendSMS = require("../services/sendSMS");

const validateOrderSchema = (req, res, next) => {
  const { error } = orderValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  } else {
    next();
  }
};

// ✅ PLACE ORDER
router.post("/place", isAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { address, items } = req.body;

    // ===============================
    // VALIDATION
    // ===============================

    if (!items || items.length === 0) {
      return res.status(400).json({
        error: "Items are required",
      });
    }

    if (!address) {
      return res.status(400).json({
        error: "Address is required",
      });
    }

    // ===============================
    // TOTAL
    // ===============================

    const totalAmount = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const fixedItems = items.map((item) => ({
      ...item,
      image: Array.isArray(item.image) ? item.image[0] : item.image,
    }));

    // ===============================
    // CREATE ORDER
    // ===============================

    // const order = new Order({
    //   userId,
    //    items: fixedItems,
    //   totalAmount,
    //   address
    // });

    // ================= TRACKING ID =================

    const trackingId = "JAIN" + Math.floor(100000 + Math.random() * 900000);

    // ================= DELIVERY OTP =================

    const deliveryOTP = Math.floor(1000 + Math.random() * 9000).toString();

    // ================= DELIVERY DATE =================

    const estimatedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);

    // ================= CREATE ORDER =================

    const order = new Order({
      userId,

      email: req.user.email,

      items: fixedItems,

      totalAmount,

      address,

      trackingId,

      deliveryOTP,

      estimatedDelivery,

      timeline: [
        {
          status: "Placed",

          message: "Your order has been placed successfully",
        },
      ],
    });
    await order.save();

    // =======================
    // ORDER PLACED SMS
    // =======================

    sendSMS(
      order.address.phone,

      `Your order has been placed successfully.
Tracking ID: ${order.trackingId}`,
    );

    // USER EMAIL
    sendEmail({
      to: order.email,

      subject: "Order Placed Successfully 🎉",

      html: orderPlacedTemplate(order),
    }).catch((err) => console.log("EMAIL ERROR:", err));

    // ADMIN EMAIL

    sendEmail({
      to: process.env.ADMIN_EMAIL,

      subject: "New Order Received 🛒",

      html: adminOrderTemplate(order),
    }).catch((err) => console.log("ADMIN EMAIL ERROR:", err));

    // ===============================
    // CLEAR CART
    // ===============================

    const cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    // ===============================
    // RESPONSE
    // ===============================

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.log("ORDER ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ✅ GET USER ORDERS
router.get("/my", isAuth, async (req, res) => {
  const userId = req.user.id;

  const orders = await Order.find({ userId }).sort({ createdAt: -1 });

  res.json(orders);
});

// ======================================
// ADMIN - GET ALL ORDERS
// ======================================

// ===============================
// ADMIN - GET ALL ORDERS
// ===============================
router.get("/admin/all", isAuth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// CANCEL ORDER

router.put("/cancel/:id", isAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    order.status = "Cancelled";

    order.timeline.push({
      status: "Cancelled",
      message: "Order has been cancelled",
      time: new Date(),
    });

    await order.save();

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ✅ GET SINGLE ORDER
router.get("/:id", isAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ===============================
// DOWNLOAD INVOICE
// ===============================

router.get("/invoice/:id", isAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    generateInvoice(order, res);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ============================================
// UPDATE ORDER STATUS
// ============================================

router.put("/update-status/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    // =========================
    // UPDATE STATUS
    // =========================

    order.status = status;

    // =========================
    // DELIVERY TIME
    // =========================

    if (status === "Delivered") {
      order.deliveredAt = new Date();
    }

    // =========================
    // TIMELINE MESSAGE
    // =========================

    let message = "";

    switch (status) {
      case "Confirmed":
        message = "Your order has been confirmed";
        break;

      case "Packed":
        message = "Your order has been packed";
        break;

      case "Shipped":
        message = "Your order has been shipped";
        break;

      case "Out For Delivery":
        message = "Your order is out for delivery";
        break;

      case "Delivered":
        message = "Order delivered successfully";
        break;

      case "Cancelled":
        message = "Order has been cancelled";
        break;

      default:
        message = "Order status updated";
    }

    // =========================
    // PUSH TIMELINE
    // =========================

    order.timeline.push({
      status,

      message,

      time: new Date(),
    });

    await order.save();

    // ===================================
    // SEND STATUS EMAILS
    // ===================================

    if (status === "Shipped") {
      await sendEmail({
        to: order.email,

        subject: "Your Order Has Been Shipped 🚚",

        html: shippedTemplate(order),
      });
    }

    if (status === "Out For Delivery") {
      await sendEmail({
        to: order.email,

        subject: "Order Out For Delivery 🚛",

        html: outForDeliveryTemplate(order),
      });
    }

    if (status === "Delivered") {
      await sendEmail({
        to: order.email,

        subject: "Order Delivered Successfully ✅",

        html: deliveredTemplate(order),
      });
    }

    res.json({
      success: true,

      order,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ======================================
// VERIFY DELIVERY OTP
// ======================================

router.post("/verify-delivery-otp/:id", async (req, res) => {
  try {
    const { otp } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    // =========================
    // OTP CHECK
    // =========================

    if (order.deliveryOTP !== otp) {
      return res.status(400).json({
        error: "Invalid OTP",
      });
    }

    // =========================
    // UPDATE ORDER
    // =========================

    order.otpVerified = true;

    order.status = "Delivered";

    order.deliveredAt = new Date();

    order.timeline.push({
      status: "Delivered",

      message: "Order delivered successfully via OTP verification",

      time: new Date(),
    });

    await order.save();

    // =========================
    // DELIVERY EMAIL
    // =========================

    sendEmail({
      to: order.email,

      subject: "Order Delivered Successfully ✅",

      html: deliveredTemplate(order),
    }).catch((err) => console.log(err));

    res.json({
      success: true,

      message: "OTP verified successfully",

      order,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ===============================
// ADMIN UPDATE STATUS
// ===============================

router.put("/admin/update-status/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    const oldStatus = order.status;

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    // ==========================
    // UPDATE STATUS
    // ==========================

    order.status = status;

    // ==========================
    // AUTO TIMESTAMPS
    // ==========================

    if (status === "Confirmed") {
      order.confirmedAt = new Date();
    }

    if (status === "Packed") {
      order.packedAt = new Date();
    }

    if (status === "Shipped") {
      order.shippedAt = new Date();
    }

    if (status === "Out For Delivery") {
      order.outForDeliveryAt = new Date();
    }

    if (status === "Delivered") {
      order.deliveredAt = new Date();

      order.payment.status = "Paid";
    }

    // ==========================
    // TIMELINE MESSAGE
    // ==========================

    let message = "";

    switch (status) {
      case "Confirmed":
        message = "Your order has been confirmed";
        break;

      case "Packed":
        message = "Your order has been packed";
        break;

      case "Shipped":
        message = "Your order has been shipped";
        break;

      case "Out For Delivery":
        message = "Your order is out for delivery";
        break;

      case "Delivered":
        message = "Order delivered successfully";
        break;

      case "Cancelled":
        message = "Order has been cancelled";
        break;

      default:
        message = "Order status updated";
    }

    // ==========================
    // PUSH TIMELINE
    // ==========================

    order.timeline.push({
      status,

      message,

      time: new Date(),
    });

    await order.save();
    // ===================================
    // SOCKET LIVE UPDATE
    // ===================================

    const io = req.app.get("io");

    io.emit("orderUpdated", order);

    // ===================================
    // SEND STATUS EMAILS
    // ===================================

    if (status === "Shipped") {
      sendEmail({
        to: order.email,

        subject: "Your Order Has Been Shipped 🚚",

        html: shippedTemplate(order),
      });

      sendSMS(
        order.address.phone,

        `Your order has been shipped.
Tracking ID: ${order.trackingId}`,
      );
    }

    if (status === "Out For Delivery") {
      sendEmail({
        to: order.email,

        subject: "Order Out For Delivery 🚛",

        html: outForDeliveryTemplate(order),
      });

      sendSMS(
        order.address.phone,

        `Your order is out for delivery.
Tracking ID: ${order.trackingId}`,
      );
    }

    if (status === "Delivered" && oldStatus !== "Delivered") {
      sendEmail({
        to: order.email,

        subject: "Order Delivered Successfully ✅",

        html: deliveredTemplate(order),
      });

      sendSMS(
        order.address.phone,

        `Your order has been delivered successfully.
Thank you for shopping with Jain Ayurvedic Store.
Tracking ID: ${order.trackingId}`,
      );
    }

    res.json({
      success: true,

      order,
    });
  } catch (err) {
    console.log("ADMIN STATUS ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
