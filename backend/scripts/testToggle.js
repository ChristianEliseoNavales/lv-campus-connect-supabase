const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const Settings = require('../models/Settings');

const SETTINGS_FILE = path.join(__dirname, '../data/settings.json');

async function testToggle() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Read JSON file
    const jsonData = await fs.readFile(SETTINGS_FILE, 'utf8');
    const jsonSettings = JSON.parse(jsonData);
    
    console.log('\n📄 JSON File Settings:');
    console.log('  Registrar isEnabled:', jsonSettings.queueSystem?.registrar?.isEnabled);
    console.log('  Admissions isEnabled:', jsonSettings.queueSystem?.admissions?.isEnabled);

    // Read MongoDB
    let mongoSettings = await Settings.findOne();
    
    console.log('\n🗄️  MongoDB Settings:');
    console.log('  Registrar isEnabled:', mongoSettings.departmentSettings?.registrar?.isEnabled);
    console.log('  Admissions isEnabled:', mongoSettings.departmentSettings?.admissions?.isEnabled);

    // Simulate toggle to FALSE for registrar
    console.log('\n🔄 Simulating toggle to FALSE for registrar...');
    
    // Update JSON
    jsonSettings.queueSystem.registrar.isEnabled = false;
    jsonSettings.queueSystem.registrar.lastUpdated = new Date().toISOString();
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(jsonSettings, null, 2));
    
    // Update MongoDB
    if (!mongoSettings.departmentSettings) {
      mongoSettings.departmentSettings = {};
    }
    if (!mongoSettings.departmentSettings.registrar) {
      mongoSettings.departmentSettings.registrar = {};
    }
    mongoSettings.departmentSettings.registrar.isEnabled = false;
    await mongoSettings.save();

    console.log('✅ Toggle completed');

    // Verify
    const updatedJson = JSON.parse(await fs.readFile(SETTINGS_FILE, 'utf8'));
    const updatedMongo = await Settings.findOne();

    console.log('\n✅ Verification:');
    console.log('  JSON Registrar isEnabled:', updatedJson.queueSystem?.registrar?.isEnabled);
    console.log('  MongoDB Registrar isEnabled:', updatedMongo.departmentSettings?.registrar?.isEnabled);

    // Toggle back to TRUE
    console.log('\n🔄 Toggling back to TRUE for registrar...');
    
    updatedJson.queueSystem.registrar.isEnabled = true;
    updatedJson.queueSystem.registrar.lastUpdated = new Date().toISOString();
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(updatedJson, null, 2));
    
    updatedMongo.departmentSettings.registrar.isEnabled = true;
    await updatedMongo.save();

    console.log('✅ Toggle back completed');

    // Final verification
    const finalJson = JSON.parse(await fs.readFile(SETTINGS_FILE, 'utf8'));
    const finalMongo = await Settings.findOne();

    console.log('\n✅ Final Verification:');
    console.log('  JSON Registrar isEnabled:', finalJson.queueSystem?.registrar?.isEnabled);
    console.log('  MongoDB Registrar isEnabled:', finalMongo.departmentSettings?.registrar?.isEnabled);

    await mongoose.connection.close();
    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testToggle();

