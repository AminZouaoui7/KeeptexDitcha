const sequelize = require('./sequelize');

async function debugConstraints() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Check constraints with correct PostgreSQL query
    console.log('\n=== Constraints ===');
    const [constraints] = await sequelize.query(`
      SELECT conname, consrc 
      FROM pg_constraint 
      WHERE conrelid = '"Articles"'::regclass
    `);
    console.log('Constraints:', constraints);

    // Alternative query for constraints
    console.log('\n=== Check Constraints ===');
    const [checkConstraints] = await sequelize.query(`
      SELECT conname, pg_get_constraintdef(oid) as definition
      FROM pg_constraint 
      WHERE conrelid = '"Articles"'::regclass AND contype = 'c'
    `);
    console.log('Check constraints:', checkConstraints);

    // Check for triggers
    console.log('\n=== Triggers ===');
    const [triggers] = await sequelize.query(`
      SELECT tgname, proname
      FROM pg_trigger t
      JOIN pg_proc p ON t.tgfoid = p.oid
      WHERE t.tgrelid = '"Articles"'::regclass
    `);
    console.log('Triggers:', triggers);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

debugConstraints();