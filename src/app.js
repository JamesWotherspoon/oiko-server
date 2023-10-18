const express = require('express');
const app = express();
const middleware = require('./middleware/middleware.js');
const { logMiddleware } = require('./middleware/loggingMiddleware.js');
const authenticateUser = require('./middleware/authMiddleware.js');
const sessionRoutes = require('./routes/sessionRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const transactionRoutes = require('./routes/transactionRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');

// Logging Middleware
app.use(logMiddleware);

// Middleware
app.use(middleware.cors);
app.use(middleware.limiter);
app.use(middleware.parseJson);
app.use(middleware.cookieParser);
// app.use(middleware.helmet);

// Routes
app.use('/api/sessions', sessionRoutes.router);
app.use('/api/sessions', authenticateUser, sessionRoutes.protectedRouter);
app.use('/api/users', userRoutes.router);
app.use('/api/users', authenticateUser, userRoutes.protectedRouter);
app.use('/api/transactions', authenticateUser, transactionRoutes);
app.use('/api/categories', authenticateUser, categoryRoutes);

// Not Found Route
app.use('/', (req, res) => res.status(404).send('Sorry, resource not found!'));

// Fallback error handler
app.use(middleware.errorHandler);

module.exports = app;
