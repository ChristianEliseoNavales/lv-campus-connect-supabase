const mongoose = require('mongoose');
const { Window, Service } = require('../models');
require('dotenv').config();

async function addAdmissionsWindow() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find a service for admissions department
    const service = await Service.findOne({ department: 'admissions' });
    if (!service) {
      console.log('No service found for admissions department');
      return;
    }

    console.log('Found admissions service:', service.name);

    // Create test window for admissions
    const admissionsWindow = new Window({
      name: 'Admissions Window 1',
      department: 'admissions',
      serviceId: service._id,
      assignedAdmin: null,
      isOpen: true
    });

    await admissionsWindow.save();
    console.log('✅ Admissions test window created:', admissionsWindow.name);

    console.log('Admissions window added successfully!');
  } catch (error) {
    console.error('Error adding admissions window:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addAdmissionsWindow();
