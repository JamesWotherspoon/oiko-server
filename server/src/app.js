const express = require("express");
const app = express();
const middleware = require("./middleware/middleware.js");
const logInfo = require("./middleware/logging.middleware.js");
const logError = require("./middleware/error-logging.middleware.js");
const fallbackErrorHandler = require("./middleware/fallback-error-handler.middleware.js");
const example = require("./routes/example.routes.js");
const notFoundRoutes = require("./routes/not-found.routes.js");

// Middleware to capture request received time
app.use((req, res, next) => {
  const startTime = Date.now();
  req.startTime = startTime;
  next();
});

// Middleware
app.use(middleware);
app.use(logInfo);

// Routes
app.use("/api", example);
app.use("/", notFoundRoutes);

// throw error for testing error handling
//app.use("/", (res, req, next) => { throw new Error("Error: Test error handling") });

// Log Errors - Middleware
app.use(logError);

// Fallback error handler - Middleware
app.use(fallbackErrorHandler);

module.exports = app;
