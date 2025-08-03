const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config({ path: '../.env' });

// Token JWT à tester
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkwMjkwMDk5LCJleHAiOjE2OTI4ODIwOTl9.1vYmfILQQTrYFIJXK7cmXJUZNSd-OxPLYCEqtYBXj-I';

// Vérifier le token localement
console.log('JWT_SECRET:', process.env.JWT_SECRET);

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('Token décodé avec succès:', decoded);
} catch (err) {
  console.error('Erreur de vérification du token:', err.message);
}

// Tester l'API /api/auth/me
async function testAuthMe() {
  try {
    const response = await axios.get('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Réponse de /api/auth/me:', response.data);
  } catch (error) {
    console.error('Erreur de /api/auth/me:', error.response ? error.response.data : error.message);
  }
}

// Tester l'API /api/commandes/1/etat
async function testUpdateEtat() {
  try {
    const response = await axios.put(
      'http://localhost:5000/api/commandes/1/etat',
      { etat: 'annulee' },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log('Réponse de /api/commandes/1/etat:', response.data);
  } catch (error) {
    console.error('Erreur de /api/commandes/1/etat:', error.response ? error.response.data : error.message);
  }
}

// Exécuter les tests
testAuthMe();
testUpdateEtat();