const express = require("express");
const router = express.Router();
const Wishlist = require("../models/wishlist");
const isAuth = require("../middleware/isAuth");


// ✅ GET wishlist
router.get("/", isAuth, async (req, res) => {
  const userId = req.session.user.id;

  const wishlist = await Wishlist.findOne({ userId });

  res.json(wishlist || { items: [] });
});


// ✅ ADD TO WISHLIST

router.post("/add", isAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { _id, name, price, image } = req.body;

    const finalImage = Array.isArray(image) ? image : [image];

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    const exists = wishlist.items.find(
      item => item.productId.toString() === _id.toString()
    );

    if (!exists) {
      wishlist.items.push({
        productId: _id,
        name,
        price,
        image: finalImage
      });
    }

    await wishlist.save();

    res.json({ success: true, wishlist });

  } catch (err) {
    console.error("WISHLIST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});




// ✅ REMOVE
router.post("/remove", isAuth, async (req, res) => {
  const userId = req.session.user.id;
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) return res.json({ items: [] });

  wishlist.items = wishlist.items.filter(
    item => item.productId.toString() !== productId.toString()
  );

  await wishlist.save();

  res.json({ success: true, wishlist });
});

module.exports = router;