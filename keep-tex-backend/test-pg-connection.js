/**
 * Script de test de connexion à PostgreSQL distant
 * Ce script permet de vérifier la connexion à une base PostgreSQL
 * hébergée sur un autre PC du réseau local
 */

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Utiliser localhost pour la connexion locale
const PC_A_IP = 'localhost'; // Connexion locale (127.0.0.1)
const PC_A_PORT = '5433'; // Port PostgreSQL (vérifier qu'il s'agit bien du port utilisé)
const DB_NAME = 'keeptex';
const DB_USER = 'postgres';
const DB_PASSWORD = '1234';

// Construire l'URI de connexion
const connectionURI = `postgres://${DB_USER}:${DB_PASSWORD}@${PC_A_IP}:${PC_A_PORT}/${DB_NAME}`;

// Créer l'instance Sequelize
const sequelize = new Sequelize(connectionURI, {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    connectTimeout: 10000 // 10 secondes de timeout (utile pour les connexions réseau)
  }
});

// Fonction de test de connexion
async function testConnection() {
  console.log('='.repeat(50));
  console.log(`Tentative de connexion à PostgreSQL sur ${PC_A_IP}:${PC_A_PORT}...`);
  console.log(`URI de connexion: postgres://${DB_USER}:****@${PC_A_IP}:${PC_A_PORT}/${DB_NAME}`);
  console.log('='.repeat(50));
  
  try {
    // Tester la connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL établie avec succès!');
    
    // Exécuter une requête simple pour vérifier
    const [result] = await sequelize.query('SELECT NOW() as current_time');
    console.log(`✅ Heure du serveur PostgreSQL: ${result[0].current_time}`);
    
    // Tester l'accès aux tables
    const [tables] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    
    console.log('\n✅ Tables disponibles dans la base de données:');
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}`);
    });
    
    console.log('\n✅ Test de connexion réussi!');
  } catch (error) {
    console.error('❌ Impossible de se connecter à PostgreSQL:');
    console.error(error.message);
    console.error('\nCauses possibles:');
    console.error('1. PostgreSQL n\'est pas configuré pour accepter les connexions distantes');
    console.error('2. Le pare-feu bloque les connexions sur le port PostgreSQL');
    console.error('3. L\'adresse IP ou les identifiants sont incorrects');
    console.error('4. PostgreSQL n\'est pas démarré sur le PC distant');
  } finally {
    // Fermer la connexion
    await sequelize.close();
  }
}

// Exécuter le test
testConnection();