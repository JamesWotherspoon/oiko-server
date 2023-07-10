
const logger = require("../config/logging.config");


// Error handling middleware
const errorLoggingMiddleware = (err, req, res, next) => {
  // Generate an object of request, response, and error information
  const logErrorInfo = {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip
  };

  // Log error
  logger.error("Error:", logErrorInfo);

  next(err); // Pass the error to the next error-handling middleware
}

module.exports = errorLoggingMiddleware;
