const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';
const ADMIN_CREDENTIALS = {
  email: 'admin@keeptex.fr',
  password: 'test1234'
};

async function testMarkAbsentEndpoint() {
  try {
    console.log('🧪 Testing mark-absent endpoint with debug logging...');
    
    // 1. Get admin token
    console.log('🔑 Getting admin token...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, ADMIN_CREDENTIALS);
    const token = loginResponse.data.token;
    console.log('✅ Admin token obtained');

    // 2. Get list of employees to find a valid user ID
    console.log('👥 Getting employees...');
    const employeesResponse = await axios.get(`${API_BASE_URL}/users/employees`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (employeesResponse.data.data.length === 0) {
      console.log('❌ No employees found in database');
      return;
    }
    
    const employee = employeesResponse.data.data[0];
    console.log('✅ Found employee:', employee.id, employee.name, employee.email);

    // 3. Test mark-absent endpoint
    console.log('📝 Testing mark-absent endpoint...');
    const markResponse = await axios.put(
      `${API_BASE_URL}/users/${employee.id}/mark-absent`,
      { absenceCount: 3 },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ mark-absent response:', markResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      console.log('🔍 404 Error details:', error.response.data);
    }
  }
}

testMarkAbsentEndpoint();