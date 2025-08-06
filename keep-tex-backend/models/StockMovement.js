const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const StockMovement = sequelize.define('StockMovement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  articleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Articles',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('ENTREE', 'SORTIE'),
    allowNull: false
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantiteAvant: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantiteApres: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  raison: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Ajustement manuel'
  },
  utilisateur: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Système'
  }
}, {
  tableName: 'StockMovements',
  timestamps: true
});

// Associations - définies après l'import de tous les modèles
StockMovement.associate = (models) => {
  if (models.Article) {
    StockMovement.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'article'
    });
  }
};

module.exports = StockMovement;