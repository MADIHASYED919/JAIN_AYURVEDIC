const mongoose = require("mongoose");

const connectDB = async () => {

  try {

    await mongoose.connect(
    //  "mongodb://127.0.0.1:27017/jain-store"
    process.env.MONGO_URI
    );

    console.log("DB Connected");

  } catch (err) {

    console.log(err);

    process.exit(1);

  }

};

module.exports = connectDB;