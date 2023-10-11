const { DataTypes } = require('sequelize');
const sequelize = require('./your-sequelize-instance'); // Replace with your Sequelize instance

const ExpenseCategories = sequelize.define('ExpenseCategories', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Ensure only one row per user
  },
  category1: {
    type: DataTypes.STRING,
  },
  category2: {
    type: DataTypes.STRING,
  },
  // ... continue up to category15
});

module.exports = ExpenseCategories;
