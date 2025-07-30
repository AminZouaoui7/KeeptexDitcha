const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Veuillez ajouter votre nom' },
      len: { args: [1, 50], msg: 'Le nom ne peut pas dépasser 50 caractères' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Veuillez ajouter votre email' },
      isEmail: { msg: 'Veuillez ajouter un email valide' }
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      len: { args: [0, 20], msg: 'Le numéro de téléphone ne peut pas dépasser 20 caractères' }
    }
  },
  subject: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Veuillez ajouter un sujet' },
      len: { args: [1, 100], msg: 'Le sujet ne peut pas dépasser 100 caractères' }
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Veuillez ajouter un message' },
      len: { args: [1, 1000], msg: 'Le message ne peut pas dépasser 1000 caractères' }
    }
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Contacts',
  timestamps: true,
  updatedAt: false
});

module.exports = Contact;