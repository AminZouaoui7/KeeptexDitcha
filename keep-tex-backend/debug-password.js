const bcrypt = require('bcryptjs');
const sequelize = require('./sequelize');
require('dotenv').config();

// Import direct du modèle User
const User = require('./models/User');

async function debugPassword() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Trouver l'utilisateur admin@test.com
    const user = await User.findOne({ where: { email: 'admin@test.com' } });
    
    if (!user) {
      console.log('❌ User admin@test.com not found');
      return;
    }

    console.log('✅ User found:');
    console.log('- Email:', user.email);
    console.log('- Hashed password:', user.password);
    console.log('- Password length:', user.password ? user.password.length : 'N/A');

    // Tester la comparaison bcrypt
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, user.password);
    
    console.log('🔍 Testing password comparison:');
    console.log('- Testing password:', testPassword);
    console.log('- bcrypt.compare result:', isMatch);

    // Vérifier si le mot de passe est déjà hashé
    const isHashed = user.password && user.password.startsWith('$2');
    console.log('- Is password already hashed:', isHashed);

    // Si le mot de passe n'est pas hashé, le hasher
    if (!isHashed) {
      console.log('🔄 Hashing password...');
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      console.log('- New hashed password:', hashedPassword);
      
      await user.update({ password: hashedPassword });
      console.log('✅ Password updated with hash');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

debugPassword();