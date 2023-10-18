const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const useragent = require('express-useragent');
const { logger } = require('../utils/loggerUtils');

exports.parseJson = express.json();

exports.cookieParser = cookieParser();

exports.cors = cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
  allowedHeaders: 'Content-Type',
  methods: ['GET, POST, PUT, DELETE'],
});

exports.limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 80,
  handler: (req, res, next) => {
    // Log when the rate limit is reached
    logger.warn(`Rate limit exceeded for IP ${req.ip}`);
    // If the rate is exceeded, respond with status code 429 and an error message
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  },
});

exports.log = [
  useragent.express(),
  (req, res, next) => {
    // Store the start time for calculating response time
    req.startTime = Date.now();
    // Listen for 'finish' event on response
    res.on('finish', () => {
      const logInfo = {
        method: req.method,
        url: req.url,
        ip: req.ip,
        browser: req.useragent.browser,
        os: req.useragent.os,
        response_status: res.statusCode,
        response_time: `${Date.now() - req.startTime}ms`,
      };
      // Log the information to the logger
      logger.info(logInfo);
    });
    next();
  },
];

exports.errorHandler = (error, req, res, next) => {
  logger.error({ msg: error.message, stack: error.stack });
  res.status(error.status || 500);
  const errorResponse = {
    message: error.message || 'Internal Server Error',
  };
  // Include stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
  }
  // Send error response
  res.json({ error: errorResponse });
};
