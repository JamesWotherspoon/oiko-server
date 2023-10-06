const winston = require('winston');

const seriousLogger = winston.createLogger({
  level: 'warn',
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
  ),
  transports: [
    // Log errors and warnings to console
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    // Log errors and warnings to file serious.log
    new winston.transports.File({filename: './logs/serious.log'}),
  ],
});

const lowLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
  ),
  transports: [
    // Log info messages to file low.log
    new winston.transports.File({filename: './logs/low.log'}),
  ],
});

module.exports = {
  seriousLogger,
  lowLogger,
};
