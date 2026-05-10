const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const isAuth = require("../middleware/isAuth");



router.get("/", isAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({ items: [] }); // ✅ IMPORTANT
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/add",isAuth, async (req, res) => {
  try {

     const userId = req.session.user.id; // ✅ FIXED

     
    const {productId, name, price, image, qty } = req.body;
const finalImage = Array.isArray(image) ? image[0] : image;

if (!image) {
  return res.status(400).json({ error: "Image is required" });
}
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }


    const existing = cart.items.find(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existing) {
      existing.quantity += Number(qty);
    } else {
      cart.items.push({
        productId,
        name,
        price,
        image: finalImage, // ✅ FIXED
        quantity: Number(qty)
      });
    }

    await cart.save();

    res.json({ success: true, cart });
  } catch (err) {
    console.error("CART ERROR:", err); // 🔥 THIS WILL SHOW REAL ERROR
    res.status(500).json({ error: err.message });
  }
});





// REMOVE FROM CART
router.post("/remove",isAuth ,async (req, res) => {
  try {
      const userId = req.session.user.id;
    const {  productId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) return res.json({ items: [] });

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId.toString()
    );

    await cart.save();

    res.json({ success: true, cart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});



// SAVE FOR LATER
router.post("/save-for-later", isAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        error: "Cart not found",
      });
    }

    // FIND ITEM
    const item = cart.items.find(
      (item) =>
        item.productId.toString() ===
        productId.toString()
    );

    if (!item) {
      return res.status(404).json({
        error: "Item not found",
      });
    }

    // REMOVE FROM CART
    cart.items = cart.items.filter(
      (item) =>
        item.productId.toString() !==
        productId.toString()
    );

    // ADD TO SAVED ITEMS
    // cart.savedItems.push(item);
    if (!cart.savedItems) {
  cart.savedItems = [];
}

cart.savedItems.push(item);

    await cart.save();

    res.json({
      success: true,
      cart,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});


// MOVE BACK TO CART
router.post("/move-to-cart", isAuth, async (req, res) => {
  try {

    const userId = req.session.user.id;

    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        error: "Cart not found",
      });
    }

    // FIND SAVED ITEM
    const item = cart.savedItems.find(
      (item) =>
        item.productId.toString() ===
        productId.toString()
    );

    if (!item) {
      return res.status(404).json({
        error: "Saved item not found",
      });
    }

    // REMOVE FROM SAVED
    cart.savedItems =
      cart.savedItems.filter(
        (item) =>
          item.productId.toString() !==
          productId.toString()
      );

    // ADD TO CART
    cart.items.push(item);

    await cart.save();

    res.json({
      success: true,
      cart,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});










module.exports = router;