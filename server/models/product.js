const mongoose = require("mongoose");



const productSchema = new mongoose.Schema({
  name: String,
  price: Number,

images: [
  {
    url: String,

    public_id: String,

    isMain: {
      type: Boolean,
      default: false
    }
  }
],





  description: String,
  category: String,
  stock: {
  type: Number,
  default: 1
}
});

module.exports = mongoose.model("Product", productSchema);