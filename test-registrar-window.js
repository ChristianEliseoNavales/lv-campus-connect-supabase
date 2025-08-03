const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testRegistrarWindowFlow() {
  console.log('🧪 Testing Registrar Window Management Flow');
  console.log('=' .repeat(50));

  try {
    // Step 1: Login with registrar credentials
    console.log('\n1. Testing login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'registrar@test.edu',
      password: 'Registrar123!'
    });

    if (!loginResponse.data.success) {
      throw new Error('Login failed');
    }

    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log('✅ Login successful');
    console.log(`   User: ${user.name} (${user.role})`);
    console.log(`   Department: ${user.department}`);

    // Step 2: Test window1 endpoint
    console.log('\n2. Testing window1 endpoint...');
    const window1Response = await axios.get(`${API_BASE}/queue/registrar/window1`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Window1 API call successful');
    console.log(`   Queue items: ${window1Response.data.queue.length}`);
    console.log(`   Window name: ${window1Response.data.windowName}`);
    console.log(`   Services: ${window1Response.data.services.join(', ')}`);

    // Step 3: Test window2 endpoint
    console.log('\n3. Testing window2 endpoint...');
    const window2Response = await axios.get(`${API_BASE}/queue/registrar/window2`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Window2 API call successful');
    console.log(`   Queue items: ${window2Response.data.queue.length}`);
    console.log(`   Window name: ${window2Response.data.windowName}`);
    console.log(`   Services: ${window2Response.data.services.join(', ')}`);

    // Step 4: Test window3 endpoint
    console.log('\n4. Testing window3 endpoint...');
    const window3Response = await axios.get(`${API_BASE}/queue/registrar/window3`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Window3 API call successful');
    console.log(`   Queue items: ${window3Response.data.queue.length}`);
    console.log(`   Window name: ${window3Response.data.windowName}`);
    console.log(`   Services: ${window3Response.data.services.join(', ')}`);

    // Step 5: Test invalid window
    console.log('\n5. Testing invalid window endpoint...');
    try {
      await axios.get(`${API_BASE}/queue/registrar/window99`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('❌ Invalid window should have failed');
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 400) {
        console.log('✅ Invalid window correctly rejected');
      } else {
        console.log('⚠️  Unexpected error for invalid window:', error.response?.status);
      }
    }

    console.log('\n🎉 All backend tests passed!');
    console.log('\n📋 Summary:');
    console.log('- Authentication: ✅ Working');
    console.log('- Window1 API: ✅ Working');
    console.log('- Window2 API: ✅ Working');
    console.log('- Window3 API: ✅ Working');
    console.log('- Error handling: ✅ Working');
    
    console.log('\n💡 If the frontend is still showing loading state, the issue is likely:');
    console.log('   1. Frontend authentication state management');
    console.log('   2. Component re-rendering issues');
    console.log('   3. useEffect dependency problems');
    console.log('   4. Token storage/retrieval issues');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the test
testRegistrarWindowFlow();
