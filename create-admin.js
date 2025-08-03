const sequelize = require('./keep-tex-backend/sequelize');
const User = require('./keep-tex-backend/models/User');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function createAdminUser() {
  try {
    console.log('Connecting to database...');
    
    // Test the connection
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Create a new admin user
    console.log('Creating new admin user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test1234', salt);
    
    const newAdmin = await User.create({
      id: uuidv4(),
      name: 'Admin User',
      email: 'admin@keeptex.fr',
      password: hashedPassword,
      role: 'admin',
      emailConfirmed: true
    });
    
    console.log('New admin user created successfully!');
    console.log('\nAdmin User Details:');
    console.log('Email: admin@keeptex.fr');
    console.log('Password: test1234');
    console.log('ID:', newAdmin.id);
    
  } catch (error) {
    console.error('Failed to create admin user:', error);
  } finally {
    // Close the connection
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

// Run the function
createAdminUser();