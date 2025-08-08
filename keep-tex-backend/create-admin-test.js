const bcrypt = require('bcryptjs');
const sequelize = require('./sequelize');
require('dotenv').config();

// Import et synchronisation des modèles
const User = require('./models/User');

async function createAdminUser() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email: 'admin@test.com' } });
    if (existingUser) {
      console.log('Admin user already exists, updating password...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await existingUser.update({ password: hashedPassword });
      console.log('Admin password updated successfully!');
      return;
    }

    // Créer l'utilisateur admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin Test',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@test.com');
    console.log('Password: admin123');
    console.log('ID:', adminUser.id);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
}

createAdminUser();