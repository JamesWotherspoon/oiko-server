const winston = require("winston");

const logger = winston.createLogger({
  // Log all messages serveity level debug and above
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(), // Add a timestamp to each log entry
    winston.format.json() // Use JSON format for log entries
  ),
  transports: [
    // Log to console
    new winston.transports.Console({
      level: "error",
      format: winston.format.simple(),
    }),
    // Log to file logs.log
    // Note: Path is relative to current working directory (At the directory level the server is running)
    new winston.transports.File({ filename: "./logs/logs.log" }),
  ],
});

module.exports = logger;
