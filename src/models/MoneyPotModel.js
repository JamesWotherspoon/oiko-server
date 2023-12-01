const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./UserModel');

const MoneyPot = sequelize.define('MoneyPot', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  balanceType: {
    type: DataTypes.ENUM('positive', 'negative'),
    default: 'positive',
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

MoneyPot.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

module.exports = MoneyPot;
