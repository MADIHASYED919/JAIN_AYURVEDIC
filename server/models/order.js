const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  // ================= USER =================
  userId: {
    type: String,
    required: true
  },

  email: {
  type: String,
  required: true
},


  // ================= ITEMS =================

  items: [
    {
      productId: String,
      name: String,
      price: Number,
      image: String,
      quantity: Number
    }
  ],

  // ================= TOTAL =================

  totalAmount: {
    type: Number,
    required: true
  },

  // ================= ADDRESS =================

  address: {

    fullName: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    doorNo: {
      type: String,
      required: true
    },

    street: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    state: {
      type: String,
      required: true
    },

    pincode: {
      type: String,
      required: true
    }
  },

  // ================= PAYMENT =================

  payment: {

    method: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD"
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed"
      ],
      default: "Pending"
    }

  },

  // ================= ORDER STATUS =================

  status: {

    type: String,

    enum: [
      "Placed",
      "Confirmed",
      "Packed",
      "Shipped",
      "Out For Delivery",
      "Delivered",
      "Cancelled"
    ],

    default: "Placed"
  },

  confirmedAt: Date,

packedAt: Date,

shippedAt: Date,

outForDeliveryAt: Date,

deliveredAt: Date,

  // ================= TRACKING ID =================
trackingId: {
  type: String,
  default: () =>
    "JAIN" +
    Math.floor(
      100000 + Math.random() * 900000
    )
},

  // ================= DELIVERY OTP =================

  deliveryOTP: {
  type: String,
  default: () =>
    Math.floor(
      1000 + Math.random() * 9000
    ).toString()
},


// ================= VERIFIED OTP =================

otpVerified: {
  type: Boolean,
  default: false
},


  // ================= DELIVERY DATE =================

 estimatedDelivery: {
  type: Date,

  default: () => {
    const date = new Date();

    date.setDate(
      date.getDate() + 5
    );

    return date;
  }
},

  deliveredAt: {
    type: Date
  },

  // ================= TIMELINE =================

  timeline: [

    {
      status: String,

      message: String,

      time: {
        type: Date,
        default: Date.now
      }
    }

  ],

  // ================= CREATED =================

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports =
  mongoose.model("Order", orderSchema);