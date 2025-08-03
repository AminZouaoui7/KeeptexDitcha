const axios = require('axios');
require('dotenv').config({ path: '../.env' });

// Token JWT généré précédemment
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzUzOTgxNDc4LCJleHAiOjE3NTY1NzM0Nzh9.oPsmj6iJ-Qre8Bc3QAWl7aGwz0XidL-gqlC2cKwALc0';

// Fonction pour tester l'API avec des logs détaillés
async function testApi() {
  console.log('=== Test de l\'API avec logs détaillés ===');
  console.log('Token utilisé:', token);
  
  try {
    console.log('\n1. Test de l\'API /api/auth/me');
    const authResponse = await axios.get('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Réponse de /api/auth/me:', authResponse.data);
  } catch (error) {
    console.error('Erreur de /api/auth/me:');
    console.error('  Status:', error.response?.status);
    console.error('  Data:', error.response?.data);
    console.error('  Headers:', JSON.stringify(error.response?.headers, null, 2));
  }
  
  try {
    console.log('\n2. Test de l\'API /api/commandes/1/etat avec état "annulee"');
    const updateResponse = await axios.put(
      'http://localhost:5000/api/commandes/1/etat',
      { etat: 'annulee' },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log('Réponse de /api/commandes/1/etat:', updateResponse.data);
  } catch (error) {
    console.error('Erreur de /api/commandes/1/etat:');
    console.error('  Status:', error.response?.status);
    console.error('  Data:', error.response?.data);
    console.error('  Headers:', JSON.stringify(error.response?.headers, null, 2));
  }
}

// Exécuter le test
testApi();