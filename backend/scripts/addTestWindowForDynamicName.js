const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Window = require('../models/Window');
const Service = require('../models/Service');

async function addTestWindow() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/university-kiosk');
    console.log('✅ Connected to MongoDB');

    // Find an existing service to assign to the window
    const existingService = await Service.findOne({ department: 'registrar' });
    
    if (!existingService) {
      console.log('❌ No services found. Creating a test service first...');
      
      // Create a test service
      const testService = new Service({
        name: 'Enrollment Services',
        department: 'registrar',
        isVisible: true
      });
      
      await testService.save();
      console.log('✅ Created test service:', testService.name);
      
      // Create a test window with the new service
      const testWindow = new Window({
        name: 'Enrollment Window A',
        department: 'registrar',
        serviceId: testService._id,
        isOpen: true,
        isServing: true
      });
      
      await testWindow.save();
      console.log('✅ Created test window:', testWindow.name);
      
    } else {
      console.log('✅ Found existing service:', existingService.name);
      
      // Check if a window already exists for this service
      const existingWindow = await Window.findOne({ 
        department: 'registrar',
        serviceId: existingService._id 
      });
      
      if (existingWindow) {
        console.log('✅ Window already exists:', existingWindow.name);
        console.log('   Service:', existingService.name);
        console.log('   Department:', existingWindow.department);
        console.log('   Is Open:', existingWindow.isOpen);
      } else {
        // Create a test window with the existing service
        const testWindow = new Window({
          name: 'Registrar Service Window',
          department: 'registrar',
          serviceId: existingService._id,
          isOpen: true,
          isServing: true
        });
        
        await testWindow.save();
        console.log('✅ Created test window:', testWindow.name);
        console.log('   Assigned to service:', existingService.name);
      }
    }

    // List all windows for verification
    const allWindows = await Window.find({ department: 'registrar' })
      .populate('serviceId', 'name')
      .exec();
    
    console.log('\n📋 Current Registrar Windows:');
    allWindows.forEach(window => {
      console.log(`   - ${window.name} (Service: ${window.serviceId?.name || 'None'}, Open: ${window.isOpen})`);
    });

    console.log('\n🎯 Test Setup Complete!');
    console.log('You can now test the dynamic window name feature by:');
    console.log('1. Going to http://localhost:5173');
    console.log('2. Selecting Registrar\'s Office');
    console.log('3. Choosing the service assigned to the window');
    console.log('4. Completing the queue submission');
    console.log('5. Checking that the result shows the actual window name instead of "Window X"');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run the script
addTestWindow();
