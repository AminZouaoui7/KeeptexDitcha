const bcrypt = require('bcryptjs');
const sequelize = require('./sequelize');
require('dotenv').config();

async function forceResetPassword() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Créer le bon hash bcrypt pour admin123
    const correctHash = await bcrypt.hash('admin123', 10);
    console.log('🔑 Correct hash for admin123:', correctHash);

    // Utiliser une requête SQL directe pour éviter les hooks Sequelize
    const [result] = await sequelize.query(
      `UPDATE users SET password = :password WHERE email = :email`,
      {
        replacements: { 
          password: correctHash,
          email: 'admin@test.com'
        }
      }
    );

    console.log('✅ Password force updated via SQL:', result);

    // Vérifier que la mise à jour a fonctionné
    const [users] = await sequelize.query(
      'SELECT email, password FROM users WHERE email = :email',
      { replacements: { email: 'admin@test.com' } }
    );

    if (users.length > 0) {
      console.log('✅ User found in DB');
      console.log('- Email:', users[0].email);
      console.log('- Password hash:', users[0].password);
      
      // Tester la comparaison bcrypt
      const isMatch = await bcrypt.compare('admin123', users[0].password);
      console.log('✅ bcrypt.compare test:', isMatch);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

forceResetPassword();