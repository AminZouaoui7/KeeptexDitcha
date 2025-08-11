const { Sequelize } = require('sequelize');
const sequelize = require('./sequelize');

async function runMigration() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('Running attendance structure fix migration...');
    
    // Import the migration
    const migration = require('./migrations/20241230150000-fix-attendance-structure');
    
    // Run the migration
    await migration.up(sequelize.getQueryInterface(), Sequelize);
    
    console.log('Migration completed successfully!');
    console.log('Database structure has been updated with:');
    console.log('- Removed employee_id column');
    console.log('- Added user_id, check_in, check_out, notes columns');
    console.log('- Fixed camelCase field names (createdAt, updatedAt)');
    console.log('- Added unique constraint on (user_id, date)');
    
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runMigration();