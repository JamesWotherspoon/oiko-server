// Import required libraries
const mysql = require('mysql2');

console.log('user: ' + process.env.DB_HOST);

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true, // Whether the pool should wait for available connections or return an error immediately
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0, // Maximum number of connection requests the pool will queue before returning an error
});

// Export the pool for use in other modules
module.exports = pool;
