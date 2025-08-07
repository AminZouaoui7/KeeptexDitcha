const sequelize = require('../sequelize');

// Import all models
const StockMovement = require('./StockMovement');
const Article = require('./Article');
const User = require('./User');
const { Commande, CommandeTaille, Produit, Feedback } = require('./customModels');

// Create models object
const models = {
  StockMovement,
  Article,
  User,
  Commande,
  CommandeTaille,
  Produit,
  Feedback
};

// Set up associations for all models
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  ...models,
  sequelize
};