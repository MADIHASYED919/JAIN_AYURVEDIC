const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const isAdmin = require("../middleware/isAdmin");

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
router.post("/add", isAdmin, async (req, res) => {
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
      name: { $regex: query, $options: "i" } // 🔥 case-insensitive + partial
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
      _id: { $ne: product._id } // exclude current product
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
console.log(product)
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;