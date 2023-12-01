const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./UserModel');
const Category = require('./CategoryModel');
const ScheduledTransaction = require('./ScheduledTransactionModel');
const MoneyPot = require('./MoneyPotModel');

const Transaction = sequelize.define('Transaction',
  {
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
    moneyPotId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: MoneyPot,
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
    scheduledTransactionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ScheduledTransaction,
        key: 'id',
      },
    },
    transactionType: {
      type: DataTypes.ENUM('positive', 'negative'),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    transactionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        fields: ['transactionDate'],
      },
    ],
  },
);

Transaction.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Transaction.belongsTo(Category, {
  foreignKey: 'categoryId',
  onDelete: 'SET NULL', // Set CategoryId to NULL if category is deleted
});

Transaction.belongsTo(ScheduledTransaction, {
  foreignKey: 'scheduledTransactionId',
  onDelete: 'SET NULL', // If the scheduled transaction is deleted, set the reference to NULL
});

Transaction.belongsTo(MoneyPot, {
  foreignKey: 'moneyPotId',
  onDelete: 'SET NULL', // If the money pot is deleted, set the reference to NULL
});

module.exports = Transaction;
