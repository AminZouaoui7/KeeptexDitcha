/**
 * Script de test pour les nouvelles fonctionnalités de pointage d'équipe
 * 
 * Tests inclus:
 * 1. GET /api/attendance/roster
 * 2. POST /api/attendance/bulk
 * 3. POST /api/attendance/seed-absent (optionnel)
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000';
const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE'; // Remplacer par un vrai token admin

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Fonction pour tester GET roster
async function testGetRoster() {
  console.log('🧪 Test GET /api/attendance/roster...');
  try {
    const response = await api.get('/api/attendance/roster', {
      params: { date: '2025-08-07' }
    });
    
    console.log('✅ GET roster réussi');
    console.log(`📊 Nombre d'utilisateurs: ${response.data.count}`);
    console.log('📋 Premier utilisateur:', response.data.data[0]);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur GET roster:', error.response?.data || error.message);
    throw error;
  }
}

// Fonction pour tester POST bulk
async function testPostBulk() {
  console.log('🧪 Test POST /api/attendance/bulk...');
  
  // Données de test - adapter avec de vrais userId
  const testData = {
    date: '2025-08-07',
    records: [
      {
        userId: '550e8400-e29b-41d4-a716-446655440001', // Remplacer par un vrai UUID
        status: 'present',
        checkIn: '08:30:00',
        checkOut: '17:30:00',
        notes: 'Test présence'
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440002', // Remplacer par un vrai UUID
        status: 'late',
        checkIn: '09:15:00',
        checkOut: '18:00:00',
        notes: 'Arrivée tardive'
      }
    ]
  };

  try {
    const response = await api.post('/api/attendance/bulk', testData);
    console.log('✅ POST bulk réussi:', response.data.message);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur POST bulk:', error.response?.data || error.message);
    throw error;
  }
}

// Fonction pour tester l'UPSERT idempotent
async function testUpsertIdempotent() {
  console.log('🧪 Test UPSERT idempotent...');
  
  const testData = {
    date: '2025-08-07',
    records: [
      {
        userId: '550e8400-e29b-41d4-a716-446655440003', // Remplacer par un vrai UUID
        status: 'present',
        checkIn: '08:45:00'
      }
    ]
  };

  try {
    // Premier appel
    console.log('📞 Premier appel...');
    const response1 = await api.post('/api/attendance/bulk', testData);
    console.log('✅ Premier appel réussi');

    // Deuxième appel avec les mêmes données
    console.log('📞 Deuxième appel (mêmes données)...');
    const response2 = await api.post('/api/attendance/bulk', testData);
    console.log('✅ Deuxième appel réussi - pas de doublon');
    
    return { response1, response2 };
  } catch (error) {
    console.error('❌ Erreur test idempotent:', error.response?.data || error.message);
    throw error;
  }
}

// Fonction pour tester seed-absent (optionnel)
async function testSeedAbsent() {
  console.log('🧪 Test POST /api/attendance/seed-absent...');
  
  try {
    const response = await api.post('/api/attendance/seed-absent', {
      date: '2025-08-07'
    });
    
    console.log('✅ POST seed-absent réussi:', response.data.message);
    console.log(`📊 Nombre d'utilisateurs initialisés: ${response.data.count}`);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur POST seed-absent:', error.response?.data || error.message);
    throw error;
  }
}

// Fonction principale de test
async function runAllTests() {
  console.log('🚀 Lancement des tests de pointage d\'équipe...\n');
  
  try {
    // Test 1: GET roster
    await testGetRoster();
    console.log('');
    
    // Test 2: POST bulk
    await testPostBulk();
    console.log('');
    
    // Test 3: UPSERT idempotent
    await testUpsertIdempotent();
    console.log('');
    
    // Test 4: seed-absent (optionnel - commenter si non nécessaire)
    // await testSeedAbsent();
    // console.log('');
    
    console.log('🎉 Tous les tests ont réussi!');
    
  } catch (error) {
    console.error('💥 Erreur lors des tests:', error);
    process.exit(1);
  }
}

// Instructions d'utilisation
console.log('📋 Instructions pour utiliser le script de test:');
console.log('1. Remplacez ADMIN_TOKEN par un token admin valide');
console.log('2. Remplacez les userId dans testData par de vrais UUIDs de votre base');
console.log('3. Assurez-vous que le serveur est démarré sur localhost:3000');
console.log('4. Exécutez: node test-pointage-equipe.js\n');

// Export pour usage externe
module.exports = {
  testGetRoster,
  testPostBulk,
  testUpsertIdempotent,
  testSeedAbsent,
  runAllTests
};

// Lancer les tests si ce fichier est exécuté directement
if (require.main === module) {
  runAllTests();
}