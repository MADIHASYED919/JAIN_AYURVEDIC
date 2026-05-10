const mongoose = require("mongoose");



const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: [String],
  description: String,
  category: String,
  stock: {
  type: Number,
  default: 1
}
});

module.exports = mongoose.model("Product", productSchema);