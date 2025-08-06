const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false,
});

// We'll synchronize models after they're all defined
// to avoid circular dependencies

module.exports = sequelize;