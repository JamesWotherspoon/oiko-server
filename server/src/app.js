const express = require('express');
const app = express();
const middleware = require('./middleware/middleware.js');
const logMiddleware = require('./middleware/logging.middleware.js');
const example = require('./routes/example.routes.js');
const notFoundRoutes = require('./routes/not-found.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const authenticateUser = require('./middleware/authMiddleware.js');
const testRoutes = require('./routes/test.routes.js');

// Logging Middleware
app.use(logMiddleware.useragent);
app.use(logMiddleware.log);

// Middleware
app.use(middleware.cors);
app.use(middleware.limiter());
app.use(middleware.parseJson());
app.use(middleware.cookieParser());

// Routes
// Test Route
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes.router);
app.use('/api/auth', authenticateUser, authRoutes.protectedRouter);
app.use('/api', example);
app.use('/', notFoundRoutes);

// Fallback error handler - Middleware
app.use(middleware.errorHandler);

module.exports = app;
