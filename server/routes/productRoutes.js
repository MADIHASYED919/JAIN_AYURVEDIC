const express = require("express");
const router = express.Router();
const Product = require("../models/product.js");
const isAdmin = require("../middleware/isAdmin.js");
const isAuth = require("../middleware/isAuth.js");


  const upload =
  require("../middleware/uploads.js");


router.get("/", async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;

    let query = {};

    // ✅ category
    if (category && category !== "All") {
      query.category = category.toLowerCase();
    }

    // ✅ price range
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query);

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  // console.log(product)
  res.json(product);
});

// ✅ ADMIN ADD PRODUCT
router.post("/add", isAuth, isAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.json([]);
    }

    const products = await Product.find({
      name: { $regex: query, $options: "i" }, // 🔥 case-insensitive + partial
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ RELATED PRODUCTS
router.get("/related/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }, // exclude current product
    }).limit(8); // limit like Amazon

    res.json(related);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.log(product);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE PRODUCT

router.put("/update/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// DELETE PRODUCT

router.delete("/delete/:id", isAuth, isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ADMIN PRODUCTS

router.get("/admin/all", isAuth, isAdmin, async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});




// ===============================
// IMAGE UPLOAD
// ===============================
router.post(
  "/upload",
  isAuth,
  isAdmin,
  upload.single("image"),

  async (req, res) => {
    try {

      res.json({
        imageUrl: req.file.path,
      });

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });

    }
  }
);




module.exports = router;
