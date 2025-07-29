const axios = require('axios');

async function testUpdateProfile() {
  const email = `testuser@example.com`;
  const password = 'Test1234';
  try {
    // Register user
    await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: email,
      password: password,
      role: 'client',
      emailConfirmationCode: 'DUMMY'
    });
    console.log('User registered');
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error && err.response.data.error.includes('déjà utilisé')) {
      console.log('User already registered');
    } else {
      console.error('Registration error:', err.response ? err.response.data : err.message);
      return;
    }
  }

  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: email,
      password: password
    });
    const token = loginRes.data.token;
    console.log('Login successful, token:', token);

    const updateRes = await axios.put('http://localhost:5000/api/users/profile',
      { name: 'Updated Test User' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Update profile response:', updateRes.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

testUpdateProfile();