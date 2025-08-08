const axios = require('axios');

async function simpleTest() {
  console.log('🧪 Simple mark-absent test...');
  
  try {
    // Login first
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@keeptex.fr',
      password: 'test1234'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Logged in successfully');
    
    // Test with a known employee
    const employeeId = '68211ac5-2622-4904-ab74-e4b2dc64043b';
    console.log('📝 Testing mark-absent with ID:', employeeId);
    
    const response = await axios.put(
      `http://localhost:5000/api/users/${employeeId}/mark-absent`,
      { absenceCount: 5 },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Success:', response.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.status, error.response?.data);
  }
}

simpleTest();