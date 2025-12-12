const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  console.log("MONGO_URI =", process.env.MONGO_URI); // debug

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("MongoDB Atlas connected successfully ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
