const useragent = require('express-useragent');
const winston = require('winston');

// Create loggers for regular logs and error logs
const logFilePath = './logs/server.log';
const errorFilePath = './logs/serverError.log';
const apiErrorFilePath = './logs/apiError.log';

// Create Winston transports for logging to files
const apiErrorFileTransport = new winston.transports.File({ filename: apiErrorFilePath });

// Create a Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.File({ filename: logFilePath })],
  exceptionHandlers: [new winston.transports.File({ filename: errorFilePath })],
});
// Create a Winston logger for invalid api requests
const apiRequestErrorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [apiErrorFileTransport], // Use apiErrorFileTransport for invalid api requests
});

const logMiddleware = [
  // Add useragent information to the request
  useragent.express(),
  // Log the request information
  (req, res, next) => {
    // Store the start time for calculating response time
    req.startTime = Date.now();

    // Listen for 'finish' event on response
    res.on('finish', () => {
      const logInfo = {
        method: req.method,
        url: req.url,
        ip: req.ip,
        browser: req.useragent.browser,
        os: req.useragent.os,
        response_status: res.statusCode,
        response_time: `${Date.now() - req.startTime}ms`,
      };

      // Log the information to the logger
      logger.info(logInfo);
    });

    // Listen for 'error' event on response
    res.on('error', (err) => {
      const errorLog = {
        method: req.method,
        url: req.url,
        ip: req.ip,
        error_message: err.message,
        error_stack: err.stack,
      };

      // Log the error information to the logger
      logger.error(errorLog);
    });

    next();
  },
];

module.exports = { logMiddleware, apiRequestErrorLogger };
