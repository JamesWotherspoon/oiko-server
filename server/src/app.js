const express = require('express');
const app = express();
const middleware = require('./middleware/middleware.js');
const logInfo = require('./middleware/logging.middleware.js');
const logError = require('./middleware/error-logging.middleware.js');
const fallbackErrorHandler = require('./middleware/fallback-error-handler.middleware.js');
const example = require('./routes/example.routes.js');
const notFoundRoutes = require('./routes/not-found.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const cookieParser = require('cookie-parser');
const verifyToken = require('./auth/verifyToken.js');
const cors = require('cors');

// Middleware to capture request received time
app.use((req, res, next) => {
  const startTime = Date.now();
  req.startTime = startTime;
  next();
});

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());

// Middleware
app.use(middleware);
app.use(logInfo);


// app.use(authenticateToken);

// Routes
app.use('/api', authRoutes);

// Protected Routes
app.use('/api', verifyToken, example);

/*
router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/income', incomeRoutes);
router.use('/api/expenses', expensesRoutes);
router.use('/api/recurring-bills', recurringBillsRoutes);
*/
app.use('/', notFoundRoutes);

// throw error for testing error handling
// app.use("/", (res, req, next) => { throw new Error("Error: Test error handling") })

// Log Errors - Middleware
app.use(logError);

// Fallback error handler - Middleware
app.use(fallbackErrorHandler);

module.exports = app;
