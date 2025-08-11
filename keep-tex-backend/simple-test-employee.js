const axios = require('axios');

// Test avec un ID d'employé existant
const testEmployeeEndpoint = async () => {
  try {
    console.log('🧪 Test de l\'endpoint GET /api/employees/:id');
    
    // Utiliser un ID d'employé existant
    const employeeId = '68211ac5-2622-4904-ab74-e4b2dc64043b';
    
    // Pour ce test simple, nous allons utiliser une authentification simplifiée
    // ou créer un token manuellement
    console.log(`Test de l'endpoint: http://localhost:5000/api/employees/${employeeId}`);
    
    // Afficher les instructions pour tester avec curl
    console.log('\n📋 Instructions pour tester avec curl:');
    console.log(`curl -X GET http://localhost:5000/api/employees/${employeeId}`);
    console.log('curl -X GET http://localhost:5000/api/employees/ID_INEXISTANT');
    console.log('\n⚠️  N\'oubliez pas d\'ajouter le header Authorization avec votre token JWT');
    console.log('curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/employees/ID');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
};

testEmployeeEndpoint();