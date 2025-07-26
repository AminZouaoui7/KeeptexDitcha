const { Sequelize } = require('sequelize');
const Admin = require('./models/Admin');

const sequelize = new Sequelize(process.env.POSTGRES_URI || 'postgres://user:password@localhost:5432/keep_tex_db', {
  dialect: 'postgres',
  logging: false,
});

// Synchronize Admin model
sequelize.sync({ alter: true })
  .then(() => console.log('Admin model synchronized'))
  .catch(err => console.error('Error synchronizing Admin model:', err));

module.exports = sequelize;
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_URI || 'postgres://postgres:1234@localhost:5433/keeptex', {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;