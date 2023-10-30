const winston = require('winston');

const serverErrorLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: new winston.transports.File({
    filename: './logs/serverError.log',
  }),
});
const clientErrorLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.File({
    filename: './logs/clientError.log',
  })],
});
const scheduledActionLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.File({
    filename: './logs/scheduledAction.log',
  })],
});
const successResponseLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.File({
    filename: './logs/successResponse.log',
  })],
});

module.exports = {
  serverErrorLogger,
  clientErrorLogger,
  scheduledActionLogger,
  successResponseLogger,
};
