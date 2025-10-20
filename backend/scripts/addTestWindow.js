const mongoose = require('mongoose');
const { Window, Service } = require('../models');
require('dotenv').config();

async function addTestWindow() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find a service for registrar department
    const service = await Service.findOne({ department: 'registrar' });
    if (!service) {
      console.log('No service found for registrar department');
      return;
    }

    console.log('Found service:', service.name);

    // Create test window
    const testWindow = new Window({
      name: 'Window 1',
      department: 'registrar',
      serviceId: service._id,
      assignedAdmin: null,
      isOpen: true
    });

    await testWindow.save();
    console.log('✅ Test window created:', testWindow.name);

    // Create another test window
    const testWindow2 = new Window({
      name: 'Window 2',
      department: 'registrar',
      serviceId: service._id,
      assignedAdmin: null,
      isOpen: true
    });

    await testWindow2.save();
    console.log('✅ Test window 2 created:', testWindow2.name);

    // Find a service for admissions department
    const admissionsService = await Service.findOne({ department: 'admissions' });
    if (admissionsService) {
      console.log('Found admissions service:', admissionsService.name);

      // Create test window for admissions
      const admissionsWindow = new Window({
        name: 'Admissions Window 1',
        department: 'admissions',
        serviceId: admissionsService._id,
        assignedAdmin: null,
        isOpen: true
      });

      await admissionsWindow.save();
      console.log('✅ Admissions test window created:', admissionsWindow.name);
    } else {
      console.log('No service found for admissions department');
    }

    console.log('Test windows added successfully!');
  } catch (error) {
    console.error('Error adding test windows:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addTestWindow();
