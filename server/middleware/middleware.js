const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');

// Middleware to parse body to json format 
app.use(express.json()) 

// Middleware for setting headers
app.use((req, res, next) => {
  // Set the Content-Security-Policy header to only allow content recieved from this server
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'");
  next();
});

// Middleware for limiting HTTP request rates
// Limit by IP address
const limiter = rateLimit({
  windowMs: 60 * 1000, // Time span 
  max: 1000, // Max amount per time span 
});
app.use(limiter);

// Error handling 
app.use((err, req, res, next) => {
  console.error('Error:', err.message); // Log the error message
  res.status(500).json({ error: 'Internal Server Error' }); //  500 - "The server encountered an unexpected condition that prevented it from fulfilling the request"
});

module.exports = app;