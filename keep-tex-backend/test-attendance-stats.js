const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';

async function testAttendanceStats() {
  try {
    console.log('=== Test des statistiques de présence mensuelles ===\n');

    // 1. Connexion pour obtenir un token
    console.log('1. Connexion...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtenu');

    // 2. Test avec mois valide
    console.log('\n2. Test avec mois valide (2024-12)...');
    try {
      const statsResponse = await axios.get(`${API_BASE_URL}/attendance/stats?month=2024-12`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Route /attendance/stats réussie');
      console.log('Données:', JSON.stringify(statsResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Erreur /attendance/stats:', error.response?.data || error.message);
    }

    // 3. Test avec alias /performance
    console.log('\n3. Test avec alias /performance...');
    try {
      const perfResponse = await axios.get(`${API_BASE_URL}/performance?month=2024-12`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Route /performance réussie');
      console.log('Données:', JSON.stringify(perfResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Erreur /performance:', error.response?.data || error.message);
    }

    // 4. Test avec mois invalide
    console.log('\n4. Test avec mois invalide...');
    try {
      await axios.get(`${API_BASE_URL}/attendance/stats?month=invalid`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.log('✅ Validation du mois fonctionne:', error.response?.data?.message);
    }

    // 5. Test sans paramètre month
    console.log('\n5. Test sans paramètre month...');
    try {
      await axios.get(`${API_BASE_URL}/attendance/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.log('✅ Validation du paramètre fonctionne:', error.response?.data?.message);
    }

    console.log('\n=== Tests terminés ===');

  } catch (error) {
    console.error('Erreur lors des tests:', error.response?.data || error.message);
    console.log('\nInstructions manuelles:');
    console.log('1. Obtenir un token:');
    console.log('   curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d \'{"email":"admin@example.com","password":"admin123"}\'');
    console.log('2. Tester les statistiques:');
    console.log('   curl -H "Authorization: Bearer <TOKEN>" "http://localhost:5000/api/attendance/stats?month=2024-12"');
    console.log('   curl -H "Authorization: Bearer <TOKEN>" "http://localhost:5000/api/performance?month=2024-12"');
  }
}

// Exécuter les tests si le script est lancé directement
if (require.main === module) {
  testAttendanceStats();
}

module.exports = { testAttendanceStats };