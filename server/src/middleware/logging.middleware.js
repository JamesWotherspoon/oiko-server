const express = require('express');
const app = express();
const logger = require('../logging.config');
const useragent = require('express-useragent');

// Register express-useragent middleware
// This adds a useragent property to request objects
app.use(useragent.express());

// Logging info
app.use((req, res, next) => {
  // Listen for 'finish' event on response
  // Generate an object of useful information
  res.on('finish', () => {
    const logInfo = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      browser: req.useragent.browser,
      version: req.useragent.version,
      os: req.useragent.os,
      response_status: res.statusCode,
      response_time: `${Date.now() - req.startTime}ms`,
    };

    // Log info
    logger.lowLogger.info('Request Response Cycle:', logInfo);
  });
  next();
});

module.exports = app;
