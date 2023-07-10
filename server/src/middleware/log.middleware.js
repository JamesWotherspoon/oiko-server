const express = require("express");
const app = express();
const logger = require("../config/log.config");
const useragent = require("express-useragent");

// Register express-useragent middleware
// This adds a useragent property to request objects
app.use(useragent.express());


// Log info
app.use((req, res, next) => {
  // Listen for 'finish' event on response
  // Generate an object of useful information and log it
  res.on("finish", () => {
    const responseInfo = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      browser: req.useragent.browser,
      version: req.useragent.version,
      os: req.useragent.os,
      response_status: res.statusCode,
      response_time: `${Date.now() - req.startTime}ms`,
    };
    logger.info(responseInfo);
  });
  next();
});

// Log Error
app.use((err, req, res, next) => {
    // Listen for 'finish' event on response
    // Generate an object of useful information and log it as error
    const errorResponseInfo = {
      message: err.message,
      stack: err.stack,
      method: req.method,
      url: req.url,
      ip: req.ip,
      browser: req.useragent.browser,
      version: req.useragent.version,
      os: req.useragent.os,
    };
    logger.error(errorResponseInfo);
  
    next();
  });

module.exports = app;
