const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const { Window, Service, Settings } = require('../models');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lvcampusconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testServiceVisibility() {
  try {
    console.log('=== Testing Service Visibility Logic ===\n');
    
    // Test for both departments
    for (const department of ['registrar', 'admissions']) {
      console.log(`\n--- Testing ${department.toUpperCase()} Department ---`);
      
      // 1. Check all services in department
      const allServices = await Service.find({ department });
      console.log(`\n1. All services in ${department}:`);
      allServices.forEach(service => {
        console.log(`   - ${service.name} (${service._id}) - Active: ${service.isActive}`);
      });
      
      // 2. Check all windows in department
      const allWindows = await Window.find({ department })
        .populate('serviceIds', 'name')
        .populate('assignedAdmin', 'name email');
      
      console.log(`\n2. All windows in ${department}:`);
      allWindows.forEach(window => {
        console.log(`   - ${window.name} (${window._id})`);
        console.log(`     * Open: ${window.isOpen}`);
        console.log(`     * Services: ${window.serviceIds?.map(s => s.name).join(', ') || 'None'}`);
        console.log(`     * Service IDs: [${window.serviceIds?.map(s => s._id).join(', ') || 'None'}]`);
        console.log(`     * Admin: ${window.assignedAdmin?.email || 'None'}`);
      });
      
      // 3. Test the aggregation pipeline
      console.log(`\n3. Testing getVisibleServices aggregation for ${department}:`);
      const visibleServices = await Window.getVisibleServices(department);
      console.log(`   Found ${visibleServices.length} visible services:`);
      visibleServices.forEach(service => {
        console.log(`   - ${service.name} (${service._id})`);
      });
      
      // 4. Check settings
      const settings = await Settings.getCurrentSettings();
      const isEnabled = department === 'registrar' ? settings.registrarQueueEnabled : settings.admissionsQueueEnabled;
      console.log(`\n4. Queue system enabled for ${department}: ${isEnabled}`);
      
      // 5. Manual aggregation debug
      console.log(`\n5. Manual aggregation debug for ${department}:`);
      const debugResult = await Window.aggregate([
        {
          $match: {
            department: department,
            isOpen: true,
            serviceIds: { $exists: true, $not: { $size: 0 } }
          }
        },
        {
          $project: {
            name: 1,
            department: 1,
            isOpen: 1,
            serviceIds: 1,
            serviceCount: { $size: '$serviceIds' }
          }
        }
      ]);
      
      console.log(`   Windows matching criteria (open + has services):`);
      debugResult.forEach(window => {
        console.log(`   - ${window.name}: ${window.serviceCount} services, IDs: [${window.serviceIds.join(', ')}]`);
      });
    }
    
    console.log('\n=== Test Complete ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

testServiceVisibility();
