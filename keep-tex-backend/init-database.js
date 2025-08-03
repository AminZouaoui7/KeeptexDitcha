const sequelize = require('./sequelize');
const { Commande, CommandeTaille, Produit, Feedback } = require('./models/customModels');
const User = require('./models/User');
const ContactPg = require('./models/ContactPg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Function to initialize the database
async function initDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Test the connection
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Sync all models
    console.log('Syncing database models...');
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
    
    // Create a test admin user
    console.log('Creating test admin user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      id: uuidv4(),
      name: 'Admin User',
      email: 'admin@keeptex.com',
      password: hashedPassword,
      role: 'admin',
      phone: '12345678',
      address: 'Admin Address'
    });
    
    // Create some test products
    console.log('Creating test products...');
    await Produit.bulkCreate([
      {
        nom: 'T-shirt Basic',
        type: 'Vêtement',
        qte: 100,
        propriete: 'Vendable',
        prix: 25
      },
      {
        nom: 'Polo Premium',
        type: 'Vêtement',
        qte: 50,
        propriete: 'Vendable',
        prix: 35
      },
      {
        nom: 'Chemise Classique',
        type: 'Vêtement',
        qte: 30,
        propriete: 'Vendable',
        prix: 45
      }
    ]);
    
    console.log('Database initialization completed successfully!');
    console.log('\nTest Admin User:');
    console.log('Email: admin@keeptex.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    // Close the connection
    await sequelize.close();
  }
}

// Run the initialization
initDatabase();