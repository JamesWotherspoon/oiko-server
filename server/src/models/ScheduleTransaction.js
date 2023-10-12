const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./User');
const Category = require('./Category');

const ScheduleTransaction = sequelize.define('ScheduleTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  CategoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Category,
      key: 'id',
    },
  },
  transactionType: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  recurrenceType: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'biannually', 'annually'),
    allowNull: false,
  },
  dayOfWeek: {
    type: DataTypes.ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
    allowNull: true,
  },
  dayOfMonth: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 31,
    },
  },
  monthOfYear: {
    type: DataTypes.ENUM(
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

ScheduleTransaction.belongsTo(User, {
  foreignKey: 'UserId',
  onDelete: 'CASCADE',
});

ScheduleTransaction.belongsTo(Category, {
  foreignKey: 'CategoryId',
  onDelete: 'SET NULL',
});

module.exports = ScheduleTransaction;
