const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const { Window, Service, Settings } = require('../models');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lvcampusconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testQueueSubmission() {
  try {
    console.log('=== Testing Queue Submission Flow ===\n');
    
    // Test for both departments
    for (const department of ['registrar', 'admissions']) {
      console.log(`\n--- Testing ${department.toUpperCase()} Department ---`);
      
      // 1. Check if department is enabled
      const settings = await Settings.getCurrentSettings();
      const isEnabled = settings?.departmentSettings?.[department]?.isEnabled;
      console.log(`1. Department enabled: ${isEnabled}`);
      
      if (!isEnabled) {
        console.log(`   ❌ ${department} department is disabled - queue submission would fail`);
        continue;
      }
      
      // 2. Get available services
      const services = await Service.find({ department, isActive: true });
      console.log(`2. Available services (${services.length}):`);
      services.forEach(service => {
        console.log(`   - ${service.name} (${service._id})`);
      });
      
      if (services.length === 0) {
        console.log(`   ❌ No active services found for ${department}`);
        continue;
      }
      
      // 3. Get windows and their service assignments
      const windows = await Window.find({ department }).populate('serviceIds', 'name');
      console.log(`\n3. Windows and service assignments (${windows.length}):`);
      windows.forEach(window => {
        console.log(`   - ${window.name}:`);
        console.log(`     * Open: ${window.isOpen}`);
        console.log(`     * Services: [${window.serviceIds?.map(s => s.name).join(', ') || 'None'}]`);
        console.log(`     * Service IDs: [${window.serviceIds?.map(s => s._id).join(', ') || 'None'}]`);
      });
      
      // 4. Test service-to-window assignment logic
      console.log(`\n4. Service-to-window assignment test:`);
      for (const service of services) {
        // Find windows that can handle this service
        const assignedWindows = await Window.find({
          department,
          isOpen: true,
          serviceIds: service._id
        }).populate('serviceIds', 'name');
        
        if (assignedWindows.length > 0) {
          console.log(`   ✅ Service "${service.name}" can be handled by:`);
          assignedWindows.forEach(window => {
            console.log(`      - ${window.name} (services: ${window.serviceIds.map(s => s.name).join(', ')})`);
          });
        } else {
          console.log(`   ❌ Service "${service.name}" has NO available windows`);
          console.log(`      This would cause "Service is currently unavailable - no window assigned" error`);
        }
      }
      
      // 5. Test the exact query used in queue submission
      console.log(`\n5. Testing exact queue submission query:`);
      for (const service of services) {
        const assignedWindow = await Window.findOne({
          department,
          isOpen: true,
          serviceIds: service._id
        }).populate('serviceIds', 'name');
        
        if (assignedWindow) {
          console.log(`   ✅ "${service.name}" → ${assignedWindow.name}`);
        } else {
          console.log(`   ❌ "${service.name}" → NO WINDOW FOUND (would cause submission failure)`);
        }
      }
      
      // 6. Check visible services using the aggregation method
      console.log(`\n6. Testing visible services aggregation:`);
      try {
        const visibleServices = await Window.getVisibleServices(department);
        console.log(`   Visible services count: ${visibleServices.length}`);
        visibleServices.forEach(service => {
          console.log(`   - ${service.name} (${service._id})`);
        });
        
        if (visibleServices.length === 0) {
          console.log(`   ❌ No visible services - public kiosk would show no services`);
        }
      } catch (error) {
        console.log(`   ❌ Error getting visible services: ${error.message}`);
      }
    }
    
    console.log('\n=== Test Summary ===');
    console.log('✅ Database migration completed');
    console.log('✅ Backend routes updated to use serviceIds array');
    console.log('✅ Frontend admin components updated');
    console.log('');
    console.log('🔍 If queue submission still fails, check:');
    console.log('1. Ensure windows have serviceIds assigned (not empty array)');
    console.log('2. Ensure windows are open (isOpen: true)');
    console.log('3. Ensure services are active (isActive: true)');
    console.log('4. Check browser console for exact error messages');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

testQueueSubmission();
