const express = require("express");
const app = express();
const middleware = require("./middleware/middleware.js");
const logMiddleware = require("./middleware/log.middleware.js");
const example = require("./routes/example.js");
const notFoundRoutes = require("./routes/notFoundRoutes.js");
const logger = require("./config/log.config.js");

// Middleware to capture request received time
app.use((req, res, next) => {
  const startTime = Date.now();
  req.startTime = startTime;
  next();
});

// Middleware
app.use(middleware);
app.use(logMiddleware);

// Routes
app.use("/api", example);
//app.use("/", notFoundRoutes);
app.use("/", (res, req, next) => {
  throw new Error("Something went wrong");

});

// Fail-safe error handler - Catch all
app.use((err, req, res, next) => {
  logger.error(err);

  res.status(err.status || 500);

  const errorResponse = {
    message: err.message || "Internal Server Error",
  };

  // Include stack trace in development mode
  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }

  // Send error response
  res.json({ error: errorResponse });
});

module.exports = app;
