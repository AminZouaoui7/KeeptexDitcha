const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Le nom est obligatoire' }
    }
  },
  categorie: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La catégorie est obligatoire' }
    }
  },
  couleur: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La couleur est obligatoire' }
    }
  },
  taille: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    set(value) {
      const num = Number(value);
      if (isNaN(num)) {
        this.setDataValue('quantite', 0);
      } else {
        this.setDataValue('quantite', Math.max(0, Math.floor(num)));
      }
    }
  },
  unite: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'L\'unité est obligatoire' }
    }
  },
  seuil: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    set(value) {
      const num = Number(value);
      if (isNaN(num)) {
        this.setDataValue('seuil', 5);
      } else {
        this.setDataValue('seuil', Math.max(0, Math.floor(num)));
      }
    }
  }
}, {
  tableName: 'Articles',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['nom', 'couleur', 'taille']
    }
  ]
});

// Associations
Article.associate = (models) => {
  Article.hasMany(models.StockMovement, {
    foreignKey: 'articleId',
    as: 'stockMovements'
  });
};

module.exports = Article;