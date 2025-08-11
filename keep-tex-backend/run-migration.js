const sequelize = require('./sequelize');
const migration = require('./migrations/20241230140000-fix-attendance-unique');

async function runMigration() {
  try {
    console.log('Starting migration...');
    
    // Get query interface
    const queryInterface = sequelize.getQueryInterface();
    const Sequelize = require('sequelize');
    
    // Run the migration
    await migration.up(queryInterface, Sequelize);
    
    console.log('Migration completed successfully!');
    
    // Sync models to ensure they're up to date
    await sequelize.sync();
    console.log('Models synchronized!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runMigration();