'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Articles', 'seuil', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5,
      validate: {
        min: 0
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Articles', 'seuil');
  }
};