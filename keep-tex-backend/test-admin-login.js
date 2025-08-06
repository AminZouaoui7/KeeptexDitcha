const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('Testing admin login with correct credentials...');
    console.log('Email: admin@keeptex.com');
    console.log('Password: admin123');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@keeptex.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('Token:', response.data.token);
    return true;
  } catch (error) {
    console.error('❌ Login failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    return false;
  }
}

async function checkUsers() {
  try {
    console.log('\nChecking users in database...');
    const User = require('./models/User');
    const users = await User.findAll();
    console.log('Users found:', users.length);
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`);
    });
  } catch (error) {
    console.error('Error checking users:', error.message);
  }
}

// Run the tests
async function runTests() {
  await testAdminLogin();
  await checkUsers();
}

runTests().catch(console.error);