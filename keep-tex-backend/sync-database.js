const sequelize = require('./sequelize');
const Article = require('./models/Article');

async function syncDatabase() {
  try {
    console.log('Connexion à la base de données...');
    await sequelize.authenticate();
    console.log('Connexion réussie.');

    console.log('Synchronisation des modèles...');
    await sequelize.sync({ force: false });
    console.log('Modèles synchronisés avec succès.');

    console.log('Table Articles créée ou déjà existante.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation :', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();