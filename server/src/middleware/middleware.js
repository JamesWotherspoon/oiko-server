const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();


exports.parseJson = () => {
  return express.json();
};
exports.cookieParser = () => cookieParser();

exports.cors = cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
  allowedHeaders: 'Content-Type',
  methods: ['GET, POST, PUT, DELETE'],
});

exports.limiter = () =>
  rateLimit({
    windowMs: 60 * 1000,
    max: 80,
    handler: (req, res, next) => {
      // If the rate is exceeded, respond with status code 429 and an error message
      res
          .status(429)
          .json({ error: 'Too many requests, please try again later.' });
      // Log when the rate limit is reached
      logger.seriousLogger.warn(`Rate limit exceeded for IP ${req.ip}`);
    },
  });

exports.errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  const errorResponse = {
    message: err.message || 'Internal Server Error',
  };
  // Include stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  // Send error response
  res.json({ error: errorResponse });
};

