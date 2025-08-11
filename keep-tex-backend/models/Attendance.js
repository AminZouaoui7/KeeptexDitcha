const { DataTypes, Model } = require('sequelize');
const sequelize = require('../sequelize');

class Attendance extends Model {
  static associate(models) {
    Attendance.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  }
}

Attendance.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
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
    type: DataTypes.ENUM('present', 'absent', 'conge'),
    allowNull: false,
    defaultValue: 'present'
  },
  checkIn: {
    type: DataTypes.TIME,
    field: 'check_in',
    allowNull: true
  },
  checkOut: {
    type: DataTypes.TIME,
    field: 'check_out',
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Attendance',
  tableName: 'attendances',
  underscored: false,
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'date'],
      name: 'attendances_user_date_unique'
    }
  ]
});

module.exports = Attendance;