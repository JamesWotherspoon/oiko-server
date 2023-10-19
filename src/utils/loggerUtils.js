const winston = require('winston');

// Create loggers for regular logs and error logs
const logFilePath = './logs/server.log';
const errorFilePath = './logs/serverError.log';
const apiErrorFilePath = './logs/apiError.log';
const scheduledTransactionFilePath = './logs/scheduledTransaction.log';

// Create Winston transports for logging to files
const apiErrorFileTransport = new winston.transports.File({ filename: apiErrorFilePath });

// Create a Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: logFilePath }),
    new winston.transports.File({ filename: errorFilePath, level: 'error' }),
  ],
});
// Create a Winston logger for invalid api requests
const apiRequestErrorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [apiErrorFileTransport], // Use apiErrorFileTransport for invalid api requests
});
const scheduledTransactionLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: scheduledTransactionFilePath }),
  ],
});
module.exports = { apiRequestErrorLogger, logger, scheduledTransactionLogger };
