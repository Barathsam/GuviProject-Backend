const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MongoDb_url);
    console.log("Connected Mongodb");
  } catch (err) {
    console.error(err);
  }
};
module.exports = connectDb;
