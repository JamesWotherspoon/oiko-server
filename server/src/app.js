const express = require('express');
const app = express();
const middleware = require('./middleware/middleware.js');
const logMiddleware = require('./middleware/logging.middleware.js');
const notFoundRoutes = require('./routes/not-found.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const authenticateUser = require('./middleware/authMiddleware.js');
const transactionRoutes = require('./routes/transaction.routes.js');
const categoryRoutes = require('./routes/category.routes.js');

// Logging Middleware
app.use(logMiddleware.useragent);
app.use(logMiddleware.log);

// Middleware
app.use(middleware.cors);
app.use(middleware.limiter);
app.use(middleware.parseJson);
app.use(middleware.cookieParser);

// Routes
app.use('/api/auth', authRoutes.router);
app.use('/api/auth', authenticateUser, authRoutes.protectedRouter);
app.use('/api/transactions', authenticateUser, transactionRoutes);
app.use('/api/categories', authenticateUser, categoryRoutes);
// Not Found Route
app.use('/', notFoundRoutes);

// Fallback error handler - Middleware
app.use(middleware.errorHandler);

module.exports = app;
