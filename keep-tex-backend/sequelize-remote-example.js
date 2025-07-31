/**
 * Exemple de configuration Sequelize pour se connecter à PostgreSQL sur un autre PC
 * 
 * Ce fichier montre comment configurer Sequelize pour se connecter à une base
 * PostgreSQL hébergée sur un autre PC du réseau local (PC A).
 */

const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

// Charger les variables d'environnement
dotenv.config();

// Option 1: Utiliser l'URI complet depuis .env
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development',
  dialectOptions: {
    // Options utiles pour les connexions réseau
    connectTimeout: 10000, // 10 secondes de timeout
    // Décommentez pour utiliser SSL en production
    // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  pool: {
    // Configuration du pool de connexions
    max: 10,        // Nombre maximum de connexions dans le pool
    min: 0,         // Nombre minimum de connexions dans le pool
    acquire: 30000, // Temps maximum en ms pour obtenir une connexion du pool
    idle: 10000     // Temps maximum en ms qu'une connexion peut être inactive avant d'être libérée
  },
});

// Option 2: Configurer avec des paramètres individuels
/*
const sequelize = new Sequelize({
  host: process.env.POSTGRES_HOST,      // Adresse IP du PC A (ex: 192.168.1.X)
  port: process.env.POSTGRES_PORT,      // Port PostgreSQL (ex: 5433)
  database: process.env.POSTGRES_DB,    // Nom de la base de données (ex: keeptex)
  username: process.env.POSTGRES_USER,  // Utilisateur PostgreSQL (ex: postgres)
  password: process.env.POSTGRES_PASSWORD, // Mot de passe PostgreSQL
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development',
  dialectOptions: {
    connectTimeout: 10000,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});
*/

// Fonction pour tester la connexion au démarrage
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL établie avec succès.');
    
    // Afficher l'heure du serveur PostgreSQL pour confirmer
    const [result] = await sequelize.query('SELECT NOW() as current_time');
    console.log(`✅ Heure du serveur PostgreSQL: ${result[0].current_time}`);
    
    return true;
  } catch (error) {
    console.error('❌ Impossible de se connecter à PostgreSQL:');
    console.error(error.message);
    
    // En production, vous pourriez vouloir arrêter l'application
    if (process.env.NODE_ENV === 'production') {
      console.error('Application arrêtée en raison d'une erreur de connexion à la base de données.');
      process.exit(1); // Code d'erreur
    }
    
    return false;
  }
}

// Exporter l'instance Sequelize et la fonction de test
module.exports = {
  sequelize,
  testDatabaseConnection
};