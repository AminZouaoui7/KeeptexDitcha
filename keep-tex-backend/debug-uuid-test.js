const UserRepository = require('./repositories/UserRepository');

async function testUUIDLookup() {
  console.log('🧪 Testing UUID lookup directly...');
  
  try {
    // Test with a known employee ID
    const testId = '68211ac5-2622-4904-ab74-e4b2dc64043b';
    console.log('Testing with ID:', testId, 'type:', typeof testId);
    
    const user = await UserRepository.findById(testId);
    console.log('User found:', user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    } : 'null');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testUUIDLookup();