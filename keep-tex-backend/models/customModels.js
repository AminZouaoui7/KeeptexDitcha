const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Client = sequelize.define('Client', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  mail: { type: DataTypes.STRING, allowNull: false },
  fullname: { type: DataTypes.STRING, allowNull: false },
  num: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'Clients' });

const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullname: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  mail: { type: DataTypes.STRING, allowNull: false },
  num: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'Admins' });

const Employee = sequelize.define('Employee', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  prenom: { type: DataTypes.STRING, allowNull: false },
  etat: { type: DataTypes.ENUM('Déclaré(e)', 'Non Déclaré(e)'), allowNull: false },
  salaire_h: { type: DataTypes.DOUBLE, allowNull: false },
  conge: { type: DataTypes.INTEGER, allowNull: false },
  absence: { type: DataTypes.INTEGER, allowNull: false },
  cin: { type: DataTypes.INTEGER, allowNull: false },
  accounte: { type: DataTypes.DOUBLE, allowNull: false },
  num: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'Employees' });

const Commande = sequelize.define('Commande', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.ENUM('Service', 'Produit'), allowNull: false },
  qte: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  etat: { type: DataTypes.ENUM('encours', 'terminé', 'annulee'), allowNull: false },
  prix: { type: DataTypes.DOUBLE, allowNull: false },
  idclient: { type: DataTypes.INTEGER, allowNull: false },
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
  idclient: { type: DataTypes.INTEGER, primaryKey: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'Feedbacks' });

module.exports = { Client, Admin, Employee, Commande, Produit, Feedback };