'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('attendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Présent', 'Absent'),
        allowNull: false
      },
      check_in: {
        type: Sequelize.STRING(5),
        allowNull: true,
        validate: {
          is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
        }
      },
      check_out: {
        type: Sequelize.STRING(5),
        allowNull: true,
        validate: {
          is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Ajouter la contrainte UNIQUE sur (employee_id, date)
    await queryInterface.addConstraint('attendances', {
      fields: ['employee_id', 'date'],
      type: 'unique',
      name: 'attendances_employee_id_date_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('attendances', 'attendances_employee_id_date_unique');
    await queryInterface.dropTable('attendances');
  }
};