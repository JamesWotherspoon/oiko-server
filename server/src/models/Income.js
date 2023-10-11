const { DataTypes } = require('sequelize');
const sequelize = require('./your-sequelize-instance'); // Replace with your Sequelize instance

const Income = sequelize.define('Income', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  UserCategoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  scheduledId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

// Define a foreign key relationship with the User model
Income.belongsTo(User, {
  foreignKey: {
    allowNull: false,
  },
});

// Define a foreign key relationship with UserCategory
Income.belongsTo(UserCategory, {
  foreignKey: 'UserCategoryId',
});

module.exports = Income;
