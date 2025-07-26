const sequelize = require('./sequelize');
const { Commande, Produit, Feedback } = require('./models/customModels');
const User = require('./models/User');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');
    await sequelize.sync({ alter: true });
    console.log('Les modèles ont été synchronisés avec la base de données.');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données :', error);
  }
}

testConnection();