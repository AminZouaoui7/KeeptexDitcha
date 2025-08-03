const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../.env' });

async function updateEnumValues() {
  console.log('Connexion à la base de données...');
  const sequelize = new Sequelize(process.env.POSTGRES_URI || 'postgres://postgres:1234@localhost:5433/keeptex', {
    dialect: 'postgres',
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');

    // Étape 1: Créer un nouveau type ENUM avec les valeurs mises à jour
    console.log('Création du nouveau type ENUM...');
    await sequelize.query(`
      CREATE TYPE "enum_Commandes_etat_new" AS ENUM (
        'en attente', 'conception', 'patronnage', 'coupe', 'confection', 
        'finition', 'controle', 'termine', 'livree', 'annulee'
      );
    `);

    // Étape 2: Ajouter une colonne temporaire avec le nouveau type
    console.log('Ajout d\'une colonne temporaire...');
    await sequelize.query(`
      ALTER TABLE "Commandes" 
      ADD COLUMN "etat_new" "enum_Commandes_etat_new";
    `);

    // Étape 3: Copier les données de l'ancienne colonne vers la nouvelle
    console.log('Copie des données vers la nouvelle colonne...');
    await sequelize.query(`
      UPDATE "Commandes" 
      SET "etat_new" = "etat"::text::"enum_Commandes_etat_new";
    `);

    // Étape 4: Supprimer l'ancienne colonne
    console.log('Suppression de l\'ancienne colonne...');
    await sequelize.query(`
      ALTER TABLE "Commandes" 
      DROP COLUMN "etat";
    `);

    // Étape 5: Renommer la nouvelle colonne
    console.log('Renommage de la nouvelle colonne...');
    await sequelize.query(`
      ALTER TABLE "Commandes" 
      RENAME COLUMN "etat_new" TO "etat";
    `);

    // Étape 6: Ajouter les contraintes NOT NULL et DEFAULT
    console.log('Ajout des contraintes...');
    await sequelize.query(`
      ALTER TABLE "Commandes" 
      ALTER COLUMN "etat" SET NOT NULL,
      ALTER COLUMN "etat" SET DEFAULT 'en attente';
    `);

    // Étape 7: Supprimer l'ancien type ENUM s'il n'est plus utilisé
    console.log('Suppression de l\'ancien type ENUM...');
    await sequelize.query(`
      DROP TYPE IF EXISTS "enum_Commandes_etat";
    `);

    console.log('Mise à jour terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
  } finally {
    await sequelize.close();
    console.log('Connexion à la base de données fermée.');
  }
}

updateEnumValues();