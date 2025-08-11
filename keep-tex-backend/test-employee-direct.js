const User = require('./models/User');
const sequelize = require('./sequelize');

async function testEmployeeEndpoint() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB réussie');
    
    // Vérifier que des employés existent
    const employee = await User.findOne({
      where: { role: 'employee' },
      attributes: ['id', 'name', 'cin', 'salaire_h', 'etat']
    });
    
    if (employee) {
      console.log('✅ Employé trouvé:');
      console.log(`ID: ${employee.id}`);
      console.log(`Nom: ${employee.name}`);
      console.log(`CIN: ${employee.cin}`);
      console.log(`Salaire/h: ${employee.salaire_h}`);
      console.log(`État: ${employee.etat}`);
      
      console.log('\n🧪 L\'endpoint GET /api/employees/:id est maintenant disponible');
      console.log(`\n📋 Pour tester:`);
      console.log(`URL: http://localhost:5000/api/employees/${employee.id}`);
      console.log('Méthode: GET');
      console.log('Headers: Authorization: Bearer [votre_token_jwt]');
      
    } else {
      console.log('❌ Aucun employé trouvé');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

testEmployeeEndpoint();