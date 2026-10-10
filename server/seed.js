require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedDB = async () => {
  try {
    // No literal fallback: this repository is public, so a default here would
    // be a published production password.
    const adminPassword = process.env.HIRA_AGRO_ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error('❌ HIRA_AGRO_ADMIN_PASSWORD is not set. Refusing to seed.');
      process.exit(1);
    }

    await connectDB();

    const adminEmail = 'admin@hiraagro.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
