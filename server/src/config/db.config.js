const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: 'mysql', // Use the appropriate dialect for your database
      pool: {
        max: 10, // Maximum number of connections in the pool
        min: 0, // Minimum number of connections in the pool
        acquire: 30000, // Maximum time (in milliseconds) that a connection can be idle before being released
        idle: 10000, // Maximum time (in milliseconds) that a connection can be idle before being released
      },
      queueLimit: 5, // Maximum number of connection requests to queue
    });

module.exports = sequelize;

