const useragent = require('express-useragent');
const winston = require('winston');

// Create loggers for regular logs and error logs
const logFilePath = './logs/server.log';
const errorFilePath = './logs/error.log';

// Create Winston transports for logging to files
const logFileTransport = new winston.transports.File({ filename: logFilePath });
const errorFileTransport = new winston.transports.File({
  filename: errorFilePath,
});

// Create a Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [logFileTransport], // Use logFileTransport for regular logs
  exceptionHandlers: [errorFileTransport], // Use errorFileTransport for exception handling
});

const logMiddleware = [
  useragent.express(),
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

module.exports = logMiddleware;
