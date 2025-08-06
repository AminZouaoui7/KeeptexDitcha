const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function debugAdminPassword() {
  try {
    console.log('🔍 Debugging admin password...');
    
    // Find admin user
    const admin = await User.findOne({ where: { email: 'admin@keeptex.com' } });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found:', {
      id: admin.id,
      email: admin.email,
      role: admin.role
    });
    
    // Test the current password
    const currentPasswordTest = 'admin123';
    const isMatch = await bcrypt.compare(currentPasswordTest, admin.password);
    
    console.log('🔑 Testing password "admin123":');
    console.log('   Expected hash matches:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Current password does not match "admin123"');
      
      // Reset password to admin123
      console.log('🔄 Resetting admin password to "admin123"...');
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash('admin123', salt);
      
      admin.password = newHash;
      await admin.save();
      
      console.log('✅ Admin password reset successfully');
      
      // Verify the new password
      const verifyNew = await bcrypt.compare('admin123', admin.password);
      console.log('✅ New password verification:', verifyNew);
    } else {
      console.log('✅ Password is already correct');
    }
    
    // Test login with axios
    const axios = require('axios');
    try {
      console.log('\n🧪 Testing login with axios...');
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'admin@keeptex.com',
        password: 'admin123'
      });
      
      console.log('✅ Login successful! Token:', response.data.token.substring(0, 20) + '...');
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugAdminPassword();