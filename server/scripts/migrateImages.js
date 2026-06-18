const mongoose = require("mongoose");

const Product = require("../models/product");

require("dotenv").config({
  path: "../.env"
});

mongoose.connect(process.env.MONGO_URI);

async function migrate() {

  const products = await Product.find();

  for (const product of products) {

    if (product.image?.length > 0) {

      product.images =
        product.image.map((url, index) => ({
          url,
          public_id: "",
          isMain: index === 0
        }));

      product.image = undefined;

      await product.save();

      console.log(
        `Updated: ${product.name}`
      );
    }
  }

  console.log("Migration completed");

  process.exit();
}

migrate();