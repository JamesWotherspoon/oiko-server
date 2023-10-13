const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./User');
const Category = require('./Category');

const ScheduledTransaction = sequelize.define('ScheduledTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  categoryId: {
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

ScheduledTransaction.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

ScheduledTransaction.belongsTo(Category, {
  foreignKey: 'categoryId',
  onDelete: 'SET NULL',
});

module.exports = ScheduledTransaction;
