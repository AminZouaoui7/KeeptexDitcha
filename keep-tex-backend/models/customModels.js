const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./User');

const Commande = sequelize.define('Commande', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.STRING(50), allowNull: false },
  type_modele: { type: DataTypes.STRING(50), allowNull: true },
  type_tissue: { type: DataTypes.STRING(50), allowNull: true },
  logo: { type: DataTypes.STRING, allowNull: true },
  logo_path: { type: DataTypes.STRING, allowNull: true },
  couleur: { type: DataTypes.STRING(50), allowNull: true },
  quantite_totale: { type: DataTypes.INTEGER, allowNull: true },
  prix_total: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  acompte_requis: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  acomptepaye: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  etat: { type: DataTypes.ENUM('en attente', 'conception', 'patronnage', 'coupe', 'confection', 'finition', 'controle', 'termine', 'livree', 'annulee'), allowNull: false, defaultValue: 'en attente' },
  userId: { type: DataTypes.UUID, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'Commandes' });

const CommandeTaille = sequelize.define('CommandeTaille', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  commande_id: { type: DataTypes.INTEGER, allowNull: false },
  taille: { type: DataTypes.STRING(10), allowNull: false },
  quantite: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'CommandeTailles' });

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

// Définir les relations entre les modèles
Commande.hasMany(CommandeTaille, { foreignKey: 'commande_id', as: 'tailles' });
CommandeTaille.belongsTo(Commande, { foreignKey: 'commande_id' });

// Définir la relation entre Commande et User
Commande.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Commande, { foreignKey: 'userId' });

module.exports = { Commande, CommandeTaille, Produit, Feedback };