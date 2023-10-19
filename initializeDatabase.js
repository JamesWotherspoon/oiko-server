const sequelize = require('./src/config/dbConfig'); // Import your Sequelize instance
const User = require('./src/models/UserModel'); // Import your Sequelize models
const Transaction = require('./src/models/TransactionModel');
const ScheduledTransaction = require('./src/models/ScheduledTransactionModel');
const Category = require('./src/models/CategoryModel');
require('dotenv').config();


console.log('init db executed');

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate(); // Test the database connection
    console.log('Connected to the database.');
    // Drop all tables if they exist
    await Transaction.drop();
    await ScheduledTransaction.drop();
    await Category.drop();
    await User.drop();

    // Synchronize the models with the database
    await User.sync();
    await Category.sync();
    await ScheduledTransaction.sync();
    await Transaction.sync();

    console.log('Database synchronization completed.');
  } catch (error) {
    console.error('Error initializing the database:', error);
    throw error;
  }
};

initializeDatabase();
