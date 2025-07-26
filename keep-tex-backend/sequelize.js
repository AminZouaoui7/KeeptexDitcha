const dotenv = require('dotenv');

dotenv.config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URI || 'postgres://postgres:1234@localhost:5433/keeptex', {
  dialect: 'postgres',
  logging: false,
});

// We'll synchronize models after they're all defined
// to avoid circular dependencies

module.exports = sequelize;