const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testRegisterAndUpdateProfile() {
  try {
    // Step 1: Verify email
    const email = `testuser${Date.now()}@example.com`;
    console.log('Verifying email:', email);
    const verifyResponse = await axios.post(`${API_BASE}/auth/verify-email`, { email });
    console.log('Verify email response:', verifyResponse.data);

    if (!verifyResponse.data.success) {
      throw new Error('Email verification failed');
    }

    // For testing, we assume the code is logged or sent via email. We will try to fetch the code from a backend endpoint if available.
    // Let's add a call to get the confirmation code from backend for the email.
    let confirmationCode = null;
    try {
      const codeResponse = await axios.get(`${API_BASE}/auth/get-confirmation-code`, { params: { email } });
      console.log('Confirmation code fetch response:', codeResponse.data);
      if (codeResponse.data && codeResponse.data.code) {
        confirmationCode = codeResponse.data.code;
        console.log('Fetched confirmation code from backend:', confirmationCode);
      } else {
        console.log('No confirmation code found for email, using dummy code');
        confirmationCode = 'DUMMY';
      }
    } catch (e) {
      console.log('Error fetching confirmation code:', e.response?.data || e.message);
      confirmationCode = 'DUMMY';
    }

    // Step 2: Register user with fetched or dummy code
    const dummyCode = confirmationCode;
    try {
      const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
        name: 'Test User',
        email: email,
        password: 'Test1234',
        role: 'client',
        emailConfirmationCode: dummyCode
      });
      console.log('Register response:', registerResponse.data);

      if (!registerResponse.data.success) {
        throw new Error('Registration failed');
      }

      // Step 3: Login
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: email,
        password: 'Test1234'
      });
      console.log('Login response:', loginResponse.data);

      const token = loginResponse.data.token;
      if (!token) {
        throw new Error('Login failed, no token');
      }

      // Step 4: Update profile
      const updateResponse = await axios.put(`${API_BASE}/users/profile`,
        { name: 'Updated Test User' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Update profile response:', updateResponse.data);

    } catch (regErr) {
      console.error('Registration or update failed:', regErr.response?.data || regErr.message);
    }

  } catch (err) {
      console.error('Test failed:', err.response?.data || err.message || err);
    }
}

testRegisterAndUpdateProfile();