const axios = require('axios');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVmNTdmMTgwLTEyNjEtNDAyMy05MjIyLTMzYzMwYTJkMTQ4NyIsImlhdCI6MTc1MzU0Nzg0NSwiZXhwIjoxNzU2MTM5ODQ1fQ.bG4sRF4pczkgcsESIGLGYIMF3htHkFM5RrRNejnHJRo';

async function testAuth() {
  try {
    const response = await axios.get('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Réponse:', response.data);
  } catch (error) {
    console.error('Erreur:', error.response ? error.response.data : error.message);
  }
}

testAuth();