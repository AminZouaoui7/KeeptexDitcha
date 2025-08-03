const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

// Générer un nouveau token pour l'utilisateur avec ID 1
const userId = 1;
const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
  expiresIn: '30d'
});

console.log('Nouveau token JWT généré:');
console.log(token);

// Vérifier le token
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('\nToken vérifié avec succès:');
  console.log(decoded);
} catch (err) {
  console.error('\nErreur de vérification du token:', err.message);
}