'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Step 1: Remove employee_id column if it exists
      const tableDescription = await queryInterface.describeTable('attendances');
      if (tableDescription.employee_id) {
        await queryInterface.removeColumn('attendances', 'employee_id', { transaction });
        console.log('Removed employee_id column');
      }

      // Step 2: Remove duplicate records for (user_id, date) if any
      await queryInterface.sequelize.query(`
        DELETE FROM attendances a 
        USING attendances b 
        WHERE a.ctid < b.ctid 
        AND a.user_id = b.user_id 
        AND a.date = b.date
      `, { transaction });

      // Step 3: Ensure createdAt and updatedAt columns exist with correct names
      // The current table appears to already have the correct structure
      
      await transaction.commit();
      console.log('Migration completed successfully');
      
    } catch (error) {
      await transaction.rollback();
      console.error('Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Add employee_id column back (nullable to avoid issues)
      await queryInterface.addColumn('attendances', 'employee_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};