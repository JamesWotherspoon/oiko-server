const pool = require('./db') // Import the MySQL connection pool

// Example query using the pool
pool.getConnection((error, connection) => {
  if (error) {
    console.error('Error getting connection:', error)
    return
  }

  // Execute your query using the connection
  connection.query('SELECT * FROM your_table', (queryError, results, fields) => {
    // Release the connection back to the pool
    connection.release()

    if (queryError) {
      console.error('Error executing query:', queryError)
      return
    }

    // Process the query results here
    console.log('Query results:', results)
  })
})
