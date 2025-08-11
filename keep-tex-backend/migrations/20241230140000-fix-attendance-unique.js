'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Step 1: Remove duplicate records before adding unique constraint
      await queryInterface.sequelize.query(`
        DELETE FROM attendances a
        USING attendances b
        WHERE a.ctid < b.ctid
          AND a.user_id = b.user_id
          AND a.date = b.date;
      `, { transaction });

      // Step 2: Remove the old employee_id column if it exists
      await queryInterface.removeColumn('attendances', 'employee_id', { transaction });

      // Step 3: Remove old index if it exists
      await queryInterface.removeIndex('attendances', 'unique_employee_date', { transaction });

      // Step 4: Add user_id column if it doesn't exist (it might already exist)
      const tableDescription = await queryInterface.describeTable('attendances');
      if (!tableDescription.user_id) {
        await queryInterface.addColumn('attendances', 'user_id', {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'CASCADE'
        }, { transaction });
      }

      // Step 5: Add unique constraint on (user_id, date)
      await queryInterface.addConstraint('attendances', {
        type: 'unique',
        fields: ['user_id', 'date'],
        name: 'attendances_user_date_unique',
        transaction
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Remove unique constraint
      await queryInterface.removeConstraint('attendances', 'attendances_user_date_unique', { transaction });

      // Add back employee_id column
      await queryInterface.addColumn('attendances', 'employee_id', {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }, { transaction });

      // Add back old index
      await queryInterface.addIndex('attendances', {
        unique: true,
        fields: ['employee_id', 'date'],
        name: 'unique_employee_date'
      }, { transaction });

      // Remove user_id column
      await queryInterface.removeColumn('attendances', 'user_id', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};