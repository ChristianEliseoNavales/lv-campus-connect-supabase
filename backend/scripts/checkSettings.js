const mongoose = require('mongoose');
require('dotenv').config();

const Settings = require('../models/Settings');

async function checkSettings() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find current settings
    let settings = await Settings.findOne();
    
    if (!settings) {
      console.log('⚠️  No settings document found in MongoDB');
      console.log('Creating default settings...');
      settings = new Settings();
      await settings.save();
      console.log('✅ Default settings created');
    }

    console.log('\n📊 Current Settings:');
    console.log('Department Settings:');
    console.log('  Registrar isEnabled:', settings.departmentSettings?.registrar?.isEnabled);
    console.log('  Admissions isEnabled:', settings.departmentSettings?.admissions?.isEnabled);

    await mongoose.connection.close();
    console.log('\n✅ MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkSettings();

