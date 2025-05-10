const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://shahadvlooks4:dob03072008@userandnotes.d80ko.mongodb.net/kids_ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
      family: 4 // Force IPv4
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;