const User = require('./models/User'); // Import your Sequelize models
const sequelize = require('./config/db.config'); // Import your Sequelize instance

console.log('init db executed');

/**
 * Initializes the database by testing the connection and synchronizing Sequelize models.
 *
 * @async
 * @function
 * @throws {Error} If an error occurs during database initialization.
 *
 * @return {Promise<void>} A promise that resolves when the initialization is complete.
 */
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate(); // Test the database connection
    console.log('Connected to the database.');

    // Synchronize the models with the database
    await User.sync();

    console.log('Database synchronization completed.');
  } catch (error) {
    console.error('Error initializing the database:', error);
    throw error;
  }
};

initializeDatabase();
