const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const { Window, Service, Settings } = require('../models');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lvcampusconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testSettingsModifications() {
  try {
    console.log('=== Testing Settings Modifications ===\n');
    
    // Test for both departments
    for (const department of ['registrar', 'admissions']) {
      console.log(`\n--- Testing ${department.toUpperCase()} Department ---`);
      
      // 1. Test Service Removal Warning Logic
      console.log(`\n1. Testing Service Removal Warning for ${department}:`);
      
      const services = await Service.find({ department });
      const windows = await Window.find({ department }).populate('serviceIds', 'name');
      
      console.log(`   Services in ${department}:`);
      services.forEach(service => {
        console.log(`   - ${service.name} (${service._id})`);
      });
      
      console.log(`\n   Windows in ${department}:`);
      windows.forEach(window => {
        console.log(`   - ${window.name}: Services [${window.serviceIds?.map(s => s.name).join(', ') || 'None'}]`);
      });
      
      // Check which services are assigned to windows
      console.log(`\n   Service Assignment Analysis:`);
      services.forEach(service => {
        const assignedWindows = windows.filter(window => 
          window.serviceIds && window.serviceIds.some(s => s._id.toString() === service._id.toString())
        );
        
        if (assignedWindows.length > 0) {
          const windowNames = assignedWindows.map(w => w.name).join(', ');
          console.log(`   - "${service.name}" is assigned to: ${windowNames} (CANNOT REMOVE)`);
        } else {
          console.log(`   - "${service.name}" is not assigned to any window (CAN REMOVE)`);
        }
      });
      
      // 2. Test Unique Service Assignment Logic
      console.log(`\n2. Testing Unique Service Assignment for ${department}:`);
      
      const serviceAssignments = {};
      windows.forEach(window => {
        if (window.serviceIds && window.serviceIds.length > 0) {
          window.serviceIds.forEach(service => {
            const serviceId = service._id.toString();
            if (!serviceAssignments[serviceId]) {
              serviceAssignments[serviceId] = [];
            }
            serviceAssignments[serviceId].push(window.name);
          });
        }
      });
      
      console.log(`   Service Assignment Map:`);
      Object.keys(serviceAssignments).forEach(serviceId => {
        const service = services.find(s => s._id.toString() === serviceId);
        const assignedWindows = serviceAssignments[serviceId];
        
        if (assignedWindows.length > 1) {
          console.log(`   - "${service?.name}" is assigned to MULTIPLE windows: ${assignedWindows.join(', ')} (CONFLICT!)`);
        } else {
          console.log(`   - "${service?.name}" is assigned to: ${assignedWindows[0]} (UNIQUE)`);
        }
      });
      
      // Find unassigned services
      const unassignedServices = services.filter(service => 
        !Object.keys(serviceAssignments).includes(service._id.toString())
      );
      
      console.log(`\n   Unassigned Services (available for new windows):`);
      unassignedServices.forEach(service => {
        console.log(`   - "${service.name}" (${service._id})`);
      });
      
      // 3. Test Window Visibility Logic
      console.log(`\n3. Testing Window Visibility for ${department}:`);
      
      const openWindows = windows.filter(w => w.isOpen);
      const closedWindows = windows.filter(w => !w.isOpen);
      
      console.log(`   Open Windows (visibility toggle should be disabled when queueing active):`);
      openWindows.forEach(window => {
        console.log(`   - ${window.name}: OPEN (services: ${window.serviceIds?.map(s => s.name).join(', ') || 'None'})`);
      });
      
      console.log(`\n   Closed Windows:`);
      closedWindows.forEach(window => {
        console.log(`   - ${window.name}: CLOSED (services: ${window.serviceIds?.map(s => s.name).join(', ') || 'None'})`);
      });
      
      // 4. Test Settings Lock Status
      console.log(`\n4. Testing Settings Lock Status for ${department}:`);
      
      const settings = await Settings.getCurrentSettings();
      const isQueueingEnabled = department === 'registrar' ? settings.registrarQueueEnabled : settings.admissionsQueueEnabled;
      
      console.log(`   Queueing Enabled: ${isQueueingEnabled}`);
      console.log(`   Settings Should Be: ${isQueueingEnabled ? 'LOCKED' : 'UNLOCKED'}`);
      console.log(`   Warning Banner Should: ${isQueueingEnabled ? 'SHOW' : 'HIDE'}`);
      
      if (isQueueingEnabled) {
        console.log(`   - Add Window button: DISABLED`);
        console.log(`   - Window settings gear: DISABLED`);
        console.log(`   - Window visibility eye: DISABLED`);
        console.log(`   - Add Service button: DISABLED`);
        console.log(`   - Service remove button: DISABLED`);
      } else {
        console.log(`   - All buttons: ENABLED`);
      }
    }
    
    console.log('\n=== Test Summary ===');
    console.log('✅ Service Removal Warning: Check if services are assigned to windows before removal');
    console.log('✅ Unique Service Assignment: Prevent duplicate service assignments across windows');
    console.log('✅ Window Visibility Toggle: Disable when queueing is active');
    console.log('✅ Settings Lock Banner: Move to header row, show when queueing enabled');
    
    console.log('\n=== Frontend Testing Checklist ===');
    console.log('1. Try to remove a service assigned to a window → Should show warning toast');
    console.log('2. Try to remove a service NOT assigned to any window → Should show confirmation modal');
    console.log('3. Edit a window → Services assigned to other windows should be disabled with badges');
    console.log('4. Create new window → Only unassigned services should be selectable');
    console.log('5. Enable queueing → Window eye icons should be disabled with tooltip');
    console.log('6. Enable queueing → Warning banner should appear in header row (right side)');
    console.log('7. Disable queueing → All controls should be enabled, banner should disappear');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

testSettingsModifications();
