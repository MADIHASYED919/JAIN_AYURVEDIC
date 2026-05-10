const mongoose = require("mongoose");
const Product = require("../models/product");
require("dotenv").config();

const products = [
  {
    name: "Ashwagandha Capsules",
    price: 299,
    image: [ "/images/punarnava.jpg"],
    description: "Boosts immunity and reduces stress",
    category: "ayurvedic",
    stock: 10
  },
  {
    name: "Triphala Powder",
    price: 199,
    image: [  "/images/punarnava.jpg"],
    description: "Improves digestion naturally",
    category: "ayurvedic",
    stock: 15
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany(); // optional reset
    await Product.insertMany(products);

    console.log("✅ Database seeded successfully");
    process.exit();
  } catch (err) {
    console.log("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();