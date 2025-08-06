const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testCountEndpoints() {
  console.log('🧪 Test des endpoints de comptage par type...\n');

  try {
    // Test 1: Compter tous les mouvements par type
    console.log('1. Test GET /api/stock-movements/count-by-type');
    const response1 = await axios.get(`${API_BASE_URL}/stock-movements/count-by-type`);
    console.log('✅ Réponse:', JSON.stringify(response1.data, null, 2));
    console.log('');

    // Test 2: Compter les mouvements ENTREE
    console.log('2. Test GET /api/stock-movements/count-by-type/ENTREE');
    const response2 = await axios.get(`${API_BASE_URL}/stock-movements/count-by-type/ENTREE`);
    console.log('✅ Réponse:', JSON.stringify(response2.data, null, 2));
    console.log('');

    // Test 3: Compter les mouvements SORTIE
    console.log('3. Test GET /api/stock-movements/count-by-type/SORTIE');
    const response3 = await axios.get(`${API_BASE_URL}/stock-movements/count-by-type/SORTIE`);
    console.log('✅ Réponse:', JSON.stringify(response3.data, null, 2));
    console.log('');

    // Test 4: Test avec filtre de date
    console.log('4. Test avec filtre de date');
    const response4 = await axios.get(`${API_BASE_URL}/stock-movements/count-by-type`, {
      params: {
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      }
    });
    console.log('✅ Réponse avec date:', JSON.stringify(response4.data, null, 2));
    console.log('');

    // Test 5: Test type invalide
    console.log('5. Test avec type invalide');
    try {
      await axios.get(`${API_BASE_URL}/stock-movements/count-by-type/INVALID`);
    } catch (error) {
      console.log('✅ Erreur attendue:', error.response.data.message);
    }

    console.log('\n🎉 Tous les tests ont été exécutés avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    if (error.response) {
      console.error('Détails:', error.response.data);
    }
  }
}

// Vérifier que le serveur est accessible avant de lancer les tests
async function waitForServer() {
  console.log('⏳ Vérification du serveur...');
  
  for (let i = 0; i < 10; i++) {
    try {
      await axios.get(`${API_BASE_URL}/stock-movements/count-by-type`);
      console.log('✅ Serveur accessible\n');
      await testCountEndpoints();
      return;
    } catch (error) {
      if (i === 9) {
        console.error('❌ Serveur non accessible. Assurez-vous que le serveur est démarré sur http://localhost:3000');
        console.log('Commande: npm run dev');
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

waitForServer();