const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1); // Only exit on failure
  }
};
