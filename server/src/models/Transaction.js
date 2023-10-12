const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize-instance');
const User = require('./User');
const Category = require('./Category');

const Transaction = sequelize.define('Transaction', {
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
  ScheduledTransactionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: ScheduledTransaction,
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
  description: {
    type: DataTypes.TEXT,
  },
});

Transaction.belongsTo(User, {
  foreignKey: 'UserId',
  onDelete: 'CASCADE',
});

Transaction.belongsTo(Category, {
  foreignKey: 'CategoryId',
  onDelete: 'SET NULL', // Set CategoryId to NULL if category is deleted
});

Transaction.belongsTo(ScheduledTransaction, {
  foreignKey: 'ScheduledTransactionId',
  onDelete: 'SET NULL', // If the scheduled transaction is deleted, set the reference to NULL
});

module.exports = Transaction;
