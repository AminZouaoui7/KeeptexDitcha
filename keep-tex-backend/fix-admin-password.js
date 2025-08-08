const bcrypt = require('bcryptjs');
const sequelize = require('./sequelize');
require('dotenv').config();

// Import direct du modèle User
const User = require('./models/User');

async function fixAdminPassword() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Trouver l'utilisateur admin@test.com
    const user = await User.findOne({ where: { email: 'admin@test.com' } });
    
    if (!user) {
      console.log('❌ User admin@test.com not found');
      return;
    }

    console.log('✅ User found:', user.email);

    // Créer le bon hash bcrypt pour admin123
    const correctHash = await bcrypt.hash('admin123', 10);
    console.log('🔑 New correct hash:', correctHash);

    // Mettre à jour le mot de passe
    await user.update({ password: correctHash });
    console.log('✅ Password updated successfully');

    // Vérifier que la comparaison fonctionne
    const isMatch = await bcrypt.compare('admin123', user.password);
    console.log('✅ Password verification test:', isMatch);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

fixAdminPassword();