const User = require('./models/User');
const bcrypt = require('bcryptjs');
const sequelize = require('./sequelize');

async function fixPasswordField() {
  try {
    console.log('🔧 Fixing password field and admin credentials...');
    
    // Force sync the User model to ensure proper schema
    console.log('Syncing User model...');
    await User.sync({ force: false });
    
    // Find or create admin user with correct password
    const adminEmail = 'admin@keeptex.com';
    const adminPassword = 'admin123';
    
    let admin = await User.findOne({ where: { email: adminEmail } });
    
    if (admin) {
      console.log('✅ Admin user exists, updating password...');
    } else {
      console.log('🔄 Creating new admin user...');
    }
    
    // Create or update admin with correct password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    console.log('Generated hash length:', hashedPassword.length);
    console.log('Generated hash:', hashedPassword);
    
    if (admin) {
      admin.password = hashedPassword;
      admin.name = 'Admin User';
      admin.role = 'admin';
      await admin.save();
    } else {
      admin = await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
    }
    
    console.log('✅ Admin user updated successfully');
    
    // Verify the password works
    const testMatch = await bcrypt.compare(adminPassword, admin.password);
    console.log('✅ Password verification test:', testMatch);
    
    // Test login via API
    const axios = require('axios');
    try {
      console.log('\n🧪 Testing API login...');
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: adminEmail,
        password: adminPassword
      });
      
      console.log('✅ API login successful!');
      console.log('Token:', response.data.token.substring(0, 30) + '...');
    } catch (error) {
      console.error('❌ API login failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

fixPasswordField();