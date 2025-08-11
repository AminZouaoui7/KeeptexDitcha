const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../sequelize');

class User extends Model {
  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  getSignedJwtToken() {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Veuillez ajouter un nom' },
      len: { args: [1, 50], msg: 'Le nom ne peut pas dépasser 50 caractères' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Veuillez ajouter un email valide' },
      notEmpty: { msg: 'Veuillez ajouter un email' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: [6, 100], msg: 'Le mot de passe doit contenir au moins 6 caractères' }
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'employee', 'client'),
    defaultValue: 'user',
    set(value) {
      if (value) {
        this.setDataValue('role', value.toLowerCase());
      }
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
    set(value) {
      if (value) {
        this.setDataValue('status', value.toLowerCase());
      }
    }
  },
  // Champs pour les clients
  num: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  // Champs pour les employés
  etat: {
    type: DataTypes.ENUM('Déclaré(e)', 'Non Déclaré(e)'),
    allowNull: true
  },
  salaire_h: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    validate: {
      isNumeric: { msg: 'Le salaire horaire doit être un nombre valide' },
      min: { args: [0], msg: 'Le salaire horaire ne peut pas être négatif' }
    }
  },
  conge: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  presence: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cin: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isNumeric: { msg: 'Le numéro de téléphone doit contenir uniquement des chiffres' },
      len: { args: [8, 15], msg: 'Le numéro de téléphone doit contenir entre 8 et 15 chiffres' }
    }
  },
  accounte: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpire: {
    type: DataTypes.DATE,
    allowNull: true
  },
  emailConfirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  emailConfirmationCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tempEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tempEmailConfirmationCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Associations
User.associate = (models) => {
  if (models.Attendance) {
    User.hasMany(models.Attendance, {
      foreignKey: 'employee_id',
      as: 'attendances'
    });
  }
};

module.exports = User;