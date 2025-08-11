const axios = require('axios');

const testEmployeeEndpoint = async () => {
  try {
    console.log('🧪 Test de l\'endpoint GET /api/employees/:id');
    
    // 1. Se connecter pour obtenir un token
    console.log('1. Connexion pour obtenir un token...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtenu');

    // 2. Créer un employé de test si nécessaire
    console.log('2. Vérification des employés existants...');
    try {
      const employees = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let employeeId = null;
      const employeeUser = employees.data.users.find(user => user.role === 'employee');
      
      if (employeeUser) {
        employeeId = employeeUser.id;
        console.log('✅ Employé trouvé:', employeeUser.name);
      } else {
        console.log('3. Création d\'un employé de test...');
        const newEmployee = await axios.post('http://localhost:5000/api/auth/register', {
          name: 'Employé Test',
          email: 'employe@test.com',
          password: 'password123',
          role: 'employee',
  
          cin: 12345678,
          salaire_h: 15.50,
          etat: 'Déclaré(e)'
        });
        employeeId = newEmployee.data.user.id;
        console.log('✅ Employé de test créé');
      }

      // 3. Tester l'endpoint GET /api/employees/:id
      console.log('4. Test de l\'endpoint GET /api/employees/:id');
      const response = await axios.get(`http://localhost:5000/api/employees/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Réponse reçue:');
      console.log(JSON.stringify(response.data, null, 2));

      // 4. Tester avec un ID qui n'existe pas
      console.log('5. Test avec un ID inexistant...');
      try {
        await axios.get('http://localhost:5000/api/employees/00000000-0000-0000-0000-000000000000', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('✅ Test 404 réussi:', error.response.data.message);
        } else {
          console.log('❌ Erreur inattendue:', error.message);
        }
      }

      // 5. Tester avec un utilisateur qui n'est pas employé
      console.log('6. Test avec un utilisateur non-employé...');
      try {
        const nonEmployee = await axios.post('http://localhost:5000/api/auth/register', {
          name: 'Client Test',
          email: 'client@test.com',
          password: 'password123',
          role: 'client'
        });
        
        await axios.get(`http://localhost:5000/api/employees/${nonEmployee.data.user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('✅ Test non-employé réussi:', error.response.data.message);
        } else {
          console.log('❌ Erreur inattendue:', error.message);
        }
      }

    } catch (error) {
      console.error('❌ Erreur lors du test:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
};

testEmployeeEndpoint();