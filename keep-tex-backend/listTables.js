const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './keep-tex-backend/.env' });

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    const [results, metadata] = await sequelize.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_catalog = 'keeptex' AND table_type = 'BASE TABLE';");
    console.log('Tables in public schema:');
    if (Array.isArray(results)) {
      results.forEach(row => console.log(row.table_name));
    } else {
      console.log('No tables found or unexpected result format');
    }
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
})();