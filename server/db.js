// server/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Do not exit the process here so the API can still run in development
        // when a MongoDB URI is not available or unreachable.
        return null;
    }
};

module.exports = connectDB;
