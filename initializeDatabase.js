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

    // Synchronize the models with the database
    await User.sync({ alter: true });
    await Category.sync({ alter: true });
    await ScheduledTransaction.sync({ alter: true });
    await Transaction.sync({ alter: true });

    console.log('Database synchronization completed.');
  } catch (error) {
    console.error('Error initializing the database:', error);
    throw error;
  }
};

initializeDatabase();
