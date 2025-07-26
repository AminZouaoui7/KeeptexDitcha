const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Commande = sequelize.define('Commande', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.ENUM('Service', 'Produit'), allowNull: false },
  qte: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  etat: { type: DataTypes.ENUM('encours', 'terminé', 'annulee'), allowNull: false },
  prix: { type: DataTypes.DOUBLE, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  estimation: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true },
  photo: { type: DataTypes.BLOB('long'), allowNull: true }
}, { tableName: 'Commandes' });

const Produit = sequelize.define('Produit', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  qte: { type: DataTypes.INTEGER, allowNull: false },
  propriete: { type: DataTypes.ENUM('Vendable', 'invendable'), allowNull: false },
  prix: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'Produits' });

const Feedback = sequelize.define('Feedback', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  rate: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'Feedbacks' });

module.exports = { Commande, Produit, Feedback };