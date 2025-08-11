const User = require('./models/User');
const sequelize = require('./sequelize');

async function setupTestEmployee() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB réussie');
    
    const employees = await User.findAll({
      where: { role: 'employee' },
      attributes: ['id', 'name', 'email', 'cin', 'salaire_h', 'etat']
    });
    
    console.log('📊 Employés trouvés:', employees.length);
    if (employees.length > 0) {
      employees.forEach(emp => {
        console.log(`ID: ${emp.id}, Nom: ${emp.name}, Email: ${emp.email}`);
      });
    } else {
      console.log('Aucun employé trouvé. Création d\'un employé de test...');
      const newEmployee = await User.create({
        name: 'Jean Dupont',
        email: 'jean.dupont@test.com',
        password: 'password123',
        role: 'employee',
        cin: 12345678,
        salaire_h: 15.50,
        etat: 'Déclaré(e)'
      });
      console.log('✅ Employé de test créé avec ID:', newEmployee.id);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

setupTestEmployee();