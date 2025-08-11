const axios = require('axios');

async function testAttendanceEndpoint() {
  try {
    console.log('🧪 Testing attendance endpoint...');
    
    // First, let's get a valid employee ID
    console.log('📋 Fetching employees...');
    const employeesResponse = await axios.get('http://localhost:3000/api/users');
    const employees = employeesResponse.data.data.filter(user => user.role === 'employee');
    
    if (employees.length === 0) {
      console.log('❌ No employees found, using admin user for testing');
      const adminResponse = await axios.get('http://localhost:3000/api/users');
      const admin = adminResponse.data.data.find(user => user.role === 'admin');
      if (!admin) {
        console.log('❌ No users found at all');
        return;
      }
      employees.push(admin);
    }
    
    const employeeId = employees[0].id;
    console.log(`✅ Using employee ID: ${employeeId}`);
    
    // Test data matching Flutter format
    const testData = {
      employeeId: employeeId,
      date: '2024-12-20',
      status: 'present'
    };
    
    console.log('📤 Sending test data:', JSON.stringify(testData, null, 2));
    
    // Test GET endpoint first
    console.log('🔍 Testing GET endpoint...');
    const getResponse = await axios.get(`http://localhost:3000/api/attendance?date=2024-12-20`);
    console.log('✅ GET Response:', getResponse.data);
    
    // Test POST endpoint
    console.log('📝 Testing POST endpoint...');
    const postResponse = await axios.post('http://localhost:3000/api/attendance', testData);
    console.log('✅ POST Response:', postResponse.data);
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Error response:', error.response.status, error.response.data);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

// Test with authentication token
testAttendanceEndpoint();