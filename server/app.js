const express = require('express');
const app = express();
const middleware = require('./middleware/middleware.js');
const example = require('./routes/example.js');
const notFoundRoutes = require('./routes/notFoundRoutes.js');

// Middleware
app.use(middleware);

// Routes
app.use('/api', example);
app.use('/', notFoundRoutes);

// Fail-safe error handler - Catch all
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500);

    const errorResponse = {
        message: err.message || 'Internal Server Error',
    };

    // Include stack trace in development mode
    if (process.env.NODE_ENV === "development") {
        errorResponse.stack = err.stack;
    }

    // Send error response
    res.json({ error: errorResponse });
});

module.exports = app;
