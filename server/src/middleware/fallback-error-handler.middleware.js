// Fallback error handler - Catch all
const fallbackErrorHandler = (err, req, res, next) => {
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
};

module.exports = fallbackErrorHandler;
