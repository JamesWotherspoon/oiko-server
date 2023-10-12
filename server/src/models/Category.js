const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./User'); // Import User model

const Category = sequelize.define('Category', {
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
  type: {
    type: DataTypes.ENUM('income', 'expense'), // ENUM type for income/expense differentiation
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

// Define foreign key relationship
Category.belongsTo(User, {
  foreignKey: 'UserId',
  onDelete: 'CASCADE', // delete category if user is deleted
});

module.exports = Category;
