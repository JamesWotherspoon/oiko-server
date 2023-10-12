const sequelize = require('./config/db.config'); // Import your Sequelize instance
const User = require('./models/User'); // Import your Sequelize models
const Transaction = require('./models/Transaction');
const ScheduleTransaction = require('./models/ScheduleTransaction');
const Category = require('./models/Category');


console.log('init db executed');

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate(); // Test the database connection
    console.log('Connected to the database.');

    // Synchronize the models with the database
    await User.sync();
    await Category.sync();
    await ScheduleTransaction.sync();
    await Transaction.sync();

    console.log('Database synchronization completed.');
  } catch (error) {
    console.error('Error initializing the database:', error);
    throw error;
  }
};

initializeDatabase();
