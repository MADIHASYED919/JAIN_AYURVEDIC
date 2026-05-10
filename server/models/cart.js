const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  image: String,
  quantity: {
    type: Number,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  // MAIN CART
  items: [itemSchema],

  // SAVE FOR LATER
  savedItems: [itemSchema],
});

module.exports = mongoose.model("Cart", cartSchema);