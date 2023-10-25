const express = require('express');
const app = express();
const middleware = require('./middleware/appMiddleware.js');
const authenticateUser = require('./middleware/authMiddleware.js');
const sessionRoutes = require('./routes/sessionRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const transactionRoutes = require('./routes/transactionRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const scheduledTransactionRoutes = require('./routes/scheduledTransactionRoutes.js');
const moneyPotRoutes = require('./routes/moneyPotRoutes.js');

// Logging Middleware
app.use(middleware.log);

// Middleware
app.use(middleware.cors);
app.use(middleware.limiter);
app.use(middleware.parseJson);
app.use(middleware.cookieParser);
app.use(middleware.helmet);

// Routes
app.use('/api/sessions', sessionRoutes.router);
app.use('/api/sessions', authenticateUser, sessionRoutes.protectedRouter);
app.use('/api/users', userRoutes.router);
app.use('/api/users', authenticateUser, userRoutes.protectedRouter);
app.use('/api/transactions', authenticateUser, transactionRoutes);
app.use('/api/categories', authenticateUser, categoryRoutes);
app.use('/api/scheduled-transactions', authenticateUser, scheduledTransactionRoutes);
app.use('/api/money-pots', authenticateUser, moneyPotRoutes);

// Not Found Route
app.use('/', (req, res) => res.status(404).send('Sorry, resource not found!'));

// Fallback error handler
app.use(middleware.errorHandler);

module.exports = app;
