const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../sequelize');
require('dotenv').config();

async function createAdminUser() {
  try {
    console.log('Tentative de connexion à la base de données...');
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');

    // Vérifier si l'utilisateur admin existe déjà
    const [existingUsers] = await sequelize.query(
      "SELECT * FROM users WHERE email = 'admin@keeptex.fr'"
    );

    if (existingUsers.length > 0) {
      console.log('Un utilisateur avec cet email existe déjà.');
      console.log('Mise à jour du mot de passe...');
      
      // Hacher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('test1234', salt);
      
      // Mettre à jour l'utilisateur existant
      await sequelize.query(
        `UPDATE users SET password = '${hashedPassword}', role = 'admin' WHERE email = 'admin@keeptex.fr'`
      );
      
      console.log('Mot de passe mis à jour avec succès!');
    } else {
      console.log('Création d\'un nouvel utilisateur admin...');
      
      // Hacher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('test1234', salt);
      
      // Générer un UUID pour l'ID
      const userId = uuidv4();
      
      // Insérer le nouvel utilisateur
      await sequelize.query(
        `INSERT INTO users (id, name, email, password, role, "createdAt", "updatedAt", "emailConfirmed") 
         VALUES ('${userId}', 'Admin', 'admin@keeptex.fr', '${hashedPassword}', 'admin', NOW(), NOW(), true)`
      );
      
      console.log('Utilisateur admin créé avec succès!');
    }

    console.log('\nInformations de connexion:');
    console.log('Email: admin@keeptex.fr');
    console.log('Mot de passe: test1234');
    
    // Afficher la commande SQL pour vérifier le hash
    console.log('\nCommande SQL pour vérifier le hash du mot de passe:');
    console.log("SELECT id, name, email, password, role FROM users WHERE email = 'admin@keeptex.fr';");
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur admin:', error);
    process.exit(1);
  }
}

createAdminUser();