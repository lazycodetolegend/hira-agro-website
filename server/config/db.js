const mongoose = require('mongoose');
const dns = require('dns');

// Fix Node.js DNS SRV lookup on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore DNS override errors if restricted
}

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hira_agro';
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please make sure MongoDB is running or update MONGO_URI in server/.env');
    process.exit(1);
  }
};

module.exports = connectDB;
