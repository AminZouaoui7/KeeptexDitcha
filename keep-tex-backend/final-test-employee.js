const axios = require('axios');

const testEmployeeEndpoint = async () => {
  try {
    console.log('🧪 Test complet de l\'endpoint GET /api/employees/:id');
    
    // 1. Se connecter pour obtenir un token valide
    console.log('1. Tentative de connexion...');
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: '1754586544796@keeptemp.com',
        password: 'password123'
      });
      
      const token = loginResponse.data.token;
      console.log('✅ Token obtenu');

      // 2. Tester avec un ID d'employé valide
      console.log('2. Test avec ID d\'employé valide...');
      const validEmployeeId = '68211ac5-2622-4904-ab74-e4b2dc64043b';
      const response = await axios.get(`http://localhost:5000/api/employees/${validEmployeeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Réponse reçue:');
      console.log(JSON.stringify(response.data, null, 2));

      // 3. Tester avec un ID inexistant
      console.log('3. Test avec ID inexistant...');
      try {
        await axios.get('http://localhost:5000/api/employees/00000000-0000-0000-0000-000000000000', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('✅ Test 404 réussi:', error.response.data);
        }
      }

      // 4. Tester avec un utilisateur non-employé
      console.log('4. Test avec utilisateur non-employé...');
      try {
        await axios.get(`http://localhost:5000/api/employees/76a19f81-bf44-4688-b954-c3489156716c`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('✅ Test non-employé réussi:', error.response.data);
        }
      }

      console.log('\n🎉 Tous les tests sont réussis!');

    } catch (loginError) {
      console.log('❌ Erreur de connexion:', loginError.response?.data || loginError.message);
      console.log('\n📋 Instructions pour tester manuellement:');
      console.log('1. Obtenez un token JWT via POST /api/auth/login');
      console.log('2. Utilisez le token dans le header Authorization');
      console.log('3. Testez GET /api/employees/68211ac5-2622-4904-ab74-e4b2dc64043b');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
};

testEmployeeEndpoint();