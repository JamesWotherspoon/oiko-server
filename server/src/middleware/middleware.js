const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const logger = require('../config/logging.config');

// Middleware to parse body to json format
app.use(express.json());

// Middleware for setting headers
app.use((req, res, next) => {
  const allowedClientOrigin = process.env.CLIENT_ORIGIN;
  // Set the CORS headers to allow requests from the client origin
  res.setHeader('Access-Control-Allow-Origin', allowedClientOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Logging for non-specified origin requests
  if (req.headers.origin && req.headers.origin !== allowedClientOrigin) {
    logger.seriousLogger.warn(
        `Non-specified origin attempted to make a request: ${req.headers.origin}`,
    );
  }
  next();
});

app.use((req, res, next) => {
  // Set the Content-Security-Policy header to only allow content recieved from this server
  res.setHeader(
      'Content-Security-Policy',
      'default-src \'self\'; script-src \'self\'',
  );
  next();
});

// Middleware for limiting HTTP request rates
// Limit by IP address
const limiter = rateLimit({
  windowMs: 60 * 1000, // Time span
  max: 100, // Max amount per time span
  handler: (req, res, next) => {
    // If rate is exceeded respond with status code 429 an error message
    res
        .status(429)
        .json({error: 'Too many requests, please try again later.'});
    // Log when the rate limit is reached
    logger.seriousLogger.warn(`Rate limit exceeded for IP ${req.ip}`);
  },
});
// Register limiter to app
app.use(limiter);

// Error handling
app.use((err, req, res, next) => {
  //  500 - "The server encountered an unexpected condition that prevented it from fulfilling the request"
  res.status(500).json({error: 'Internal Server Error'});
  // Log the error message
  logger.seriousLogger.error('Error:', err.message);
});

module.exports = app;
