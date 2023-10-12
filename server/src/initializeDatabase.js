const sequelize = require('./config/db.config'); // Import your Sequelize instance
const User = require('./models/User'); // Import your Sequelize models
const Transaction = require('./models/Transaction');
const ScheduleTransaction = require('./models/ScheduleTransaction');
const Category = require('./models/Category');
require('dotenv').config();


console.log('init db executed');

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate(); // Test the database connection
    console.log('Connected to the database.');

    // Synchronize the models with the database
    await User.sync({ alter: true });
    await Category.sync({ alter: true });
    await ScheduleTransaction.sync({ alter: true });
    await Transaction.sync({ alter: true });

    console.log('Database synchronization completed.');
  } catch (error) {
    console.error('Error initializing the database:', error);
    throw error;
  }
};

initializeDatabase();
