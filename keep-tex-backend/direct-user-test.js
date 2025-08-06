const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function testDirectUserQuery() {
  try {
    console.log('🔍 Testing direct user query...');
    
    // Query user directly
    const user = await User.findOne({ 
      where: { email: 'admin@keeptex.com' } 
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      passwordLength: user.password ? user.password.length : 0
    });
    
    // Test password directly
    const testPassword = 'admin123';
    console.log('\n🔑 Testing password directly:');
    console.log('Input password:', testPassword);
    console.log('Stored hash length:', user.password.length);
    console.log('Stored hash:', user.password);
    
    const isMatch = await bcrypt.compare(testPassword, user.password);
    console.log('Password match result:', isMatch);
    
    // Test with different case variations
    const testPasswords = ['admin123', 'Admin123', 'ADMIN123'];
    for (const pwd of testPasswords) {
      const match = await bcrypt.compare(pwd, user.password);
      console.log(`Testing "${pwd}": ${match}`);
    }
    
    // Create a new hash for admin123 and compare
    console.log('\n🔄 Creating new hash for admin123...');
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash('admin123', salt);
    console.log('New hash:', newHash);
    console.log('New hash length:', newHash.length);
    
    const newMatch = await bcrypt.compare('admin123', newHash);
    console.log('New hash match test:', newMatch);
    
    // Update user password
    console.log('\n🔄 Updating user password...');
    user.password = newHash;
    await user.save();
    console.log('✅ Password updated');
    
    // Test again
    const finalMatch = await bcrypt.compare('admin123', user.password);
    console.log('Final password match:', finalMatch);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testDirectUserQuery();