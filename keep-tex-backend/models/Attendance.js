const { DataTypes, Model } = require('sequelize');
const sequelize = require('../sequelize');

class Attendance extends Model {}

Attendance.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employee_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Présent', 'Absent'),
    allowNull: false,
    defaultValue: 'Absent'
  },
  check_in: {
    type: DataTypes.STRING(5),
    allowNull: true,
    validate: {
      is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    }
  },
  check_out: {
    type: DataTypes.STRING(5),
    allowNull: true,
    validate: {
      is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    }
  }
}, {
  sequelize,
  modelName: 'Attendance',
  tableName: 'attendances',
  indexes: [
    {
      unique: true,
      fields: ['employee_id', 'date']
    }
  ]
});

// Associations
Attendance.associate = (models) => {
  Attendance.belongsTo(models.User, {
    foreignKey: 'employee_id',
    as: 'employee'
  });
};

module.exports = Attendance;