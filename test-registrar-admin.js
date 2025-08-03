const axios = require('axios');

// Test script to verify registrar admin functionality
async function testRegistrarAdmin() {
  const baseURL = 'http://localhost:3001';
  
  console.log('Testing Registrar Admin Interface...\n');
  
  try {
    // Test 1: Check if backend is running
    console.log('1. Testing backend connectivity...');
    try {
      const healthCheck = await axios.get(`${baseURL}/api/public/queue/registrar`);
      console.log('✅ Backend is running');
    } catch (error) {
      console.log('❌ Backend is not responding:', error.message);
      return;
    }
    
    // Test 2: Test public registrar queue endpoint (no auth required)
    console.log('\n2. Testing public registrar queue endpoint...');
    try {
      const publicQueue = await axios.get(`${baseURL}/api/public/queue/registrar`);
      console.log('✅ Public registrar queue endpoint working');
      console.log(`   Queue length: ${publicQueue.data.queue?.length || 0}`);
      console.log(`   Current number: ${publicQueue.data.currentNumber || 0}`);
    } catch (error) {
      console.log('❌ Public registrar queue endpoint failed:', error.response?.data?.error || error.message);
    }
    
    // Test 3: Test protected registrar queue endpoint (requires auth)
    console.log('\n3. Testing protected registrar queue endpoint...');
    try {
      const protectedQueue = await axios.get(`${baseURL}/api/queue/registrar`, {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });
      console.log('❌ Protected endpoint should have rejected invalid token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Protected registrar queue endpoint properly requires authentication');
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.error || error.message);
      }
    }
    
    // Test 4: Test registrar window endpoints
    console.log('\n4. Testing registrar window endpoints...');
    const windows = ['window1', 'window2', 'window3'];
    
    for (const window of windows) {
      try {
        const windowQueue = await axios.get(`${baseURL}/api/queue/registrar/${window}`, {
          headers: {
            'Authorization': 'Bearer invalid-token'
          }
        });
        console.log(`❌ Window ${window} endpoint should have rejected invalid token`);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`✅ Window ${window} endpoint properly requires authentication`);
        } else {
          console.log(`❌ Window ${window} unexpected error:`, error.response?.data?.error || error.message);
        }
      }
    }
    
    // Test 5: Check if services configuration exists
    console.log('\n5. Testing services configuration...');
    try {
      const fs = require('fs');
      const path = require('path');
      const servicesPath = path.join(__dirname, 'backend', 'data', 'services.json');
      
      if (fs.existsSync(servicesPath)) {
        const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));
        console.log('✅ Services configuration file exists');
        
        if (services.registrar && services.registrar.windows) {
          console.log('✅ Registrar window configuration found');
          console.log(`   Configured windows: ${Object.keys(services.registrar.windows).join(', ')}`);
        } else {
          console.log('❌ Registrar window configuration missing');
        }
      } else {
        console.log('❌ Services configuration file not found');
      }
    } catch (error) {
      console.log('❌ Error reading services configuration:', error.message);
    }
    
    // Test 6: Check queue data file
    console.log('\n6. Testing queue data file...');
    try {
      const fs = require('fs');
      const path = require('path');
      const queuePath = path.join(__dirname, 'backend', 'data', 'queue.json');
      
      if (fs.existsSync(queuePath)) {
        const queueData = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
        console.log('✅ Queue data file exists');
        
        if (queueData.registrar) {
          console.log('✅ Registrar queue data found');
          console.log(`   Queue entries: ${queueData.registrar.length}`);
        } else {
          console.log('❌ Registrar queue data missing');
        }
        
        if (queueData.currentNumbers && queueData.currentNumbers.registrar !== undefined) {
          console.log('✅ Current number tracking found');
          console.log(`   Current registrar number: ${queueData.currentNumbers.registrar}`);
        } else {
          console.log('❌ Current number tracking missing');
        }
      } else {
        console.log('❌ Queue data file not found');
      }
    } catch (error) {
      console.log('❌ Error reading queue data:', error.message);
    }
    
    console.log('\n=== Test Summary ===');
    console.log('If all tests show ✅, the registrar admin interface should work properly.');
    console.log('If any tests show ❌, those issues need to be fixed.');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testRegistrarAdmin();
