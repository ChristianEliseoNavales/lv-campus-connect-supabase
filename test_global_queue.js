const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Test data for queue submissions
const testSubmissions = [
  // Test 1: Registrar Window 1 service
  {
    department: 'registrar',
    service: 'Transcript Request',
    fullName: 'Test User 1',
    purpose: 'Testing global queue #01',
    contact: 'Phone: 123-456-7890'
  },
  // Test 2: Admissions service
  {
    department: 'admissions',
    service: 'Application Submission',
    fullName: 'Test User 2',
    purpose: 'Testing global queue #02',
    contact: 'Email: test2@example.com'
  },
  // Test 3: Registrar Window 2 service
  {
    department: 'registrar',
    service: 'Grade Inquiry',
    fullName: 'Test User 3',
    purpose: 'Testing global queue #03',
    contact: 'Phone: 987-654-3210'
  },
  // Test 4: Registrar Window 3 service
  {
    department: 'registrar',
    service: 'Student Records Update',
    fullName: 'Test User 4',
    purpose: 'Testing global queue #04',
    contact: 'Email: test4@example.com'
  },
  // Test 5: Another Admissions service
  {
    department: 'admissions',
    service: 'Document Verification',
    fullName: 'Test User 5',
    purpose: 'Testing global queue #05',
    contact: 'Phone: 555-123-4567'
  },
  // Test 6: Registrar Window 1 service again
  {
    department: 'registrar',
    service: 'Certificate of Enrollment',
    fullName: 'Test User 6',
    purpose: 'Testing global queue #06',
    contact: 'Email: test6@example.com'
  }
];

async function testGlobalQueueNumbering() {
  console.log('🧪 Testing Global Queue Numbering System (01-99 with cycling)');
  console.log('=' .repeat(60));
  
  try {
    // Submit all test entries
    for (let i = 0; i < testSubmissions.length; i++) {
      const submission = testSubmissions[i];
      console.log(`\n📝 Submitting Test ${i + 1}: ${submission.service} (${submission.department})`);
      
      const response = await axios.post(`${API_BASE}/queue/submit`, submission);
      
      if (response.status === 200) {
        console.log('Response data:', JSON.stringify(response.data, null, 2));
        const queueEntry = response.data.queueEntry || response.data;
        console.log(`✅ Success! Queue Number: ${queueEntry.queueNumber}`);
        console.log(`   - ID: ${queueEntry.id}`);
        console.log(`   - Department: ${queueEntry.department}`);
        console.log(`   - Service: ${queueEntry.service}`);
        console.log(`   - Window: ${queueEntry.window || 'N/A'}`);
        console.log(`   - Full Name: ${queueEntry.fullName}`);
      } else {
        console.log(`❌ Failed with status: ${response.status}`);
      }
      
      // Small delay between submissions
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Fetch and display final queue status
    console.log('\n' + '=' .repeat(60));
    console.log('📊 Final Queue Status:');
    console.log('=' .repeat(60));
    
    // Get registrar queue
    const registrarResponse = await axios.get(`${API_BASE}/public/queue/registrar`);
    console.log(`\n🏢 Registrar Queue (${registrarResponse.data.queue.length} entries):`);
    registrarResponse.data.queue.forEach(entry => {
      console.log(`   ${entry.queueNumber}: ${entry.fullName} - ${entry.service} (Window: ${entry.window || 'N/A'})`);
    });
    
    // Get admissions queue
    const admissionsResponse = await axios.get(`${API_BASE}/public/queue/admissions`);
    console.log(`\n🎓 Admissions Queue (${admissionsResponse.data.queue.length} entries):`);
    admissionsResponse.data.queue.forEach(entry => {
      console.log(`   ${entry.queueNumber}: ${entry.fullName} - ${entry.service}`);
    });
    
    // Test window-specific filtering
    console.log('\n' + '=' .repeat(60));
    console.log('🪟 Window-Specific Queue Filtering:');
    console.log('=' .repeat(60));
    
    for (let windowNum = 1; windowNum <= 3; windowNum++) {
      try {
        const windowResponse = await axios.get(`${API_BASE}/public/queue/registrar-windows/window${windowNum}`);
        console.log(`\n🪟 Window ${windowNum} (${windowResponse.data.queue.length} entries):`);
        console.log(`   Services: ${windowResponse.data.services.join(', ')}`);
        windowResponse.data.queue.forEach(entry => {
          console.log(`   ${entry.queueNumber}: ${entry.fullName} - ${entry.service}`);
        });
      } catch (error) {
        console.log(`\n🪟 Window ${windowNum}: Error fetching data`);
      }
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('✅ Global Queue Numbering Test Complete!');
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testGlobalQueueNumbering();
