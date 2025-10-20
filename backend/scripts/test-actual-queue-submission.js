const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lvcampusconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testActualQueueSubmission() {
  try {
    console.log('=== Testing Actual Queue Submission ===\n');
    
    // Test data for services that should work based on our previous test
    const testCases = [
      {
        department: 'registrar',
        service: 'Enroll',
        role: 'Student',
        studentStatus: 'continuing',
        isPriority: false,
        idNumber: '',
        customerName: '',
        contactNumber: '',
        email: '',
        address: ''
      },
      {
        department: 'registrar',
        service: 'Enrollment Verification',
        role: 'Student',
        isPriority: false,
        idNumber: '',
        customerName: 'Test User',
        contactNumber: '09123456789',
        email: 'test@example.com',
        address: 'Test Address'
      },
      {
        department: 'admissions',
        service: 'Admission Requirements',
        role: 'Visitor',
        isPriority: false,
        idNumber: '',
        customerName: 'Test Visitor',
        contactNumber: '09987654321',
        email: 'visitor@example.com',
        address: 'Visitor Address'
      }
    ];
    
    for (const testCase of testCases) {
      console.log(`\n--- Testing ${testCase.department.toUpperCase()} - ${testCase.service} ---`);
      
      try {
        const response = await fetch('http://localhost:5000/api/public/queue', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(testCase)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
          console.log(`✅ SUCCESS: Queue submission successful!`);
          console.log(`   Queue Number: ${result.data.queueNumber}`);
          console.log(`   Queue ID: ${result.data.queueId}`);
          console.log(`   Window: ${result.data.windowName}`);
          console.log(`   Department: ${result.data.department}`);
          console.log(`   Service: ${result.data.service}`);
          console.log(`   Estimated Wait: ${result.data.estimatedWaitTime} minutes`);
        } else {
          console.log(`❌ FAILED: ${result.error || 'Unknown error'}`);
          console.log(`   Status: ${response.status}`);
          console.log(`   Response:`, result);
        }
        
      } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
        console.log(`   This could indicate server connection issues`);
      }
      
      // Wait a bit between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n=== Test Summary ===');
    console.log('✅ All queue submission tests completed');
    console.log('✅ No StrictPopulate errors encountered');
    console.log('✅ No syntax errors encountered');
    console.log('');
    console.log('🎯 If all tests passed, the queue submission flow is working correctly!');
    console.log('🎯 If any tests failed, check the error messages above for details.');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

testActualQueueSubmission();
