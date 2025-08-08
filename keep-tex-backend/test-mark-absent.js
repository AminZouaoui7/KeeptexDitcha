const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Configuration - Valeurs de test par défaut
const ADMIN_CREDENTIALS = {
  email: 'admin@keeptex.fr',
  password: 'test1234'
};
let ADMIN_TOKEN = null;
let EMPLOYEE_USER_ID = null;

async function testMarkAbsent() {
  console.log('🧪 Test de l\'endpoint /users/:userId/mark-absent...\n');

  if (!ADMIN_TOKEN) {
    console.error('❌ Token admin non disponible');
    return;
  }

  if (!EMPLOYEE_USER_ID) {
    console.error('❌ ID employé non disponible');
    return;
  }

  try {
    // Test 1: Marquer un employé comme absent avec valeur par défaut (1 absence)
    console.log('1. Test PUT /api/users/:userId/mark-absent (valeur par défaut)');
    const response1 = await axios.put(
      `${API_BASE_URL}/users/${EMPLOYEE_USER_ID}/mark-absent`,
      {}, // Corps vide pour utiliser la valeur par défaut
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Réponse:', JSON.stringify(response1.data, null, 2));
    console.log('');

    // Test 2: Marquer un employé comme absent avec un nombre spécifique d'absences
    console.log('2. Test PUT /api/users/:userId/mark-absent (3 absences)');
    const response2 = await axios.put(
      `${API_BASE_URL}/users/${EMPLOYEE_USER_ID}/mark-absent`,
      { absenceCount: 3 },
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Réponse:', JSON.stringify(response2.data, null, 2));
    console.log('');

    // Test 3: Test avec un ID d'utilisateur inexistant
    console.log('3. Test avec ID utilisateur inexistant');
    try {
      await axios.put(
        `${API_BASE_URL}/users/00000000-0000-0000-0000-000000000000/mark-absent`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.log('❌ Erreur attendue:', error.response?.data || error.message);
    }
    console.log('');

    // Test 4: Obtenir la liste des clients pour tester avec un non-employé
    console.log('4. Recherche d\'un client pour test...');
    try {
      const clientsResponse = await axios.get(`${API_BASE_URL}/users/clients`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
      });
      
      if (clientsResponse.data.data && clientsResponse.data.data.length > 0) {
        const clientUserId = clientsResponse.data.data[0].id;
        console.log(`Test avec un utilisateur client (ID: ${clientUserId})`);
        try {
          await axios.put(
            `${API_BASE_URL}/users/${clientUserId}/mark-absent`,
            {},
            {
              headers: {
                'Authorization': `Bearer ${ADMIN_TOKEN}`,
                'Content-Type': 'application/json'
              }
            }
          );
        } catch (error) {
          console.log('❌ Erreur attendue:', error.response?.data || error.message);
        }
      } else {
        console.log('ℹ️ Aucun client disponible pour le test');
      }
    } catch (error) {
      console.log('❌ Erreur lors de la recherche de clients:', error.response?.data || error.message);
    }
    console.log('');

    console.log('🎉 Tous les tests terminés!');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
}

// Fonction pour obtenir un token admin valide
async function getAdminToken() {
  try {
    console.log('🔑 Authentification en cours...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, ADMIN_CREDENTIALS);
    ADMIN_TOKEN = response.data.token;
    console.log('✅ Token admin obtenu');
    return ADMIN_TOKEN;
  } catch (error) {
    console.error('❌ Erreur d\'authentification:', error.response?.data || error.message);
    return null;
  }
}

// Fonction pour obtenir un ID d'employé valide
async function getEmployeeUserId() {
  try {
    console.log('👤 Recherche d\'un employé...');
    const response = await axios.get(`${API_BASE_URL}/users/employees`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
    
    if (response.data.data && response.data.data.length > 0) {
      EMPLOYEE_USER_ID = response.data.data[0].id;
      console.log(`✅ Employé trouvé: ID ${EMPLOYEE_USER_ID}`);
      return EMPLOYEE_USER_ID;
    } else {
      console.log('⚠️ Aucun employé trouvé, création d\'un employé de test...');
      const createResponse = await axios.post(`${API_BASE_URL}/users/add-employee`, {
        name: 'Employé Test',
        email: 'employe@test.com',
        password: 'test123',
        role: 'employee'
      }, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
      });
      EMPLOYEE_USER_ID = createResponse.data.data.id;
      console.log(`✅ Employé créé: ID ${EMPLOYEE_USER_ID}`);
      return EMPLOYEE_USER_ID;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la recherche d\'employé:', error.response?.data || error.message);
    return null;
  }
}

// Vérifier que le serveur est accessible et exécuter les tests
async function runTests() {
  console.log('⏳ Vérification du serveur et préparation des tests...');
  
  try {
    // Étape 1: Obtenir le token admin (vérifie aussi que le serveur est accessible)
    const token = await getAdminToken();
    if (!token) {
      console.error('❌ Impossible d\'obtenir le token admin');
      return;
    }
    console.log('✅ Serveur accessible sur port 5000\n');
    
    // Étape 2: Obtenir un ID d'employé valide
    const employeeId = await getEmployeeUserId();
    if (!employeeId) {
      console.error('❌ Impossible d\'obtenir un ID d\'employé');
      return;
    }
    
    // Étape 3: Exécuter les tests
    console.log('🚀 Lancement des tests...\n');
    await testMarkAbsent();
    
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('❌ Erreur d\'authentification. Vérifiez vos identifiants admin.');
    } else {
      console.error('❌ Serveur non accessible. Assurez-vous que le serveur est démarré sur http://localhost:5000');
      console.log('Commande: node server.js');
    }
  }
}

// Si ce script est exécuté directement
if (require.main === module) {
  runTests();
}

module.exports = { testMarkAbsent };