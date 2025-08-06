'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      categorie: {
        type: Sequelize.STRING,
        allowNull: false
      },
      couleur: {
        type: Sequelize.STRING,
        allowNull: false
      },
      taille: {
        type: Sequelize.STRING,
        allowNull: true
      },
      quantite: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      unite: {
        type: Sequelize.STRING,
        allowNull: false
      },
      seuil: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Ajouter l'index unique sur nom, couleur, taille
    await queryInterface.addIndex('Articles', ['nom', 'couleur', 'taille'], {
      unique: true,
      name: 'articles_nom_couleur_taille_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Articles', 'articles_nom_couleur_taille_unique');
    await queryInterface.dropTable('Articles');
  }
};