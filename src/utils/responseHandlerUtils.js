const { apiRequestErrorLogger } = require('../middleware/loggingMiddleware');

function successResponse(res, data, message = 'Request was successful') {
  return res.status(200).json({
    status: 'success',
    message,
    data,
  });
}

function createdResponse(res, data, message = 'Resource successfully created') {
  return res.status(201).json({
    status: 'success',
    message,
    data,
  });
}

function badRequest(req, res, message = 'Bad request', error) {
  apiRequestErrorLogger.error({ path: req.path, message, error });
  return res.status(400).json({
    error: 'Bad Request',
    message,
  });
}

function notFound(res, message = 'Resource not found') {
  return res.status(404).json({
    status: 'error',
    message,
  });
}

function serverError(res, error, message = 'Internal server error') {
  return res.status(500).json({
    status: 'error',
    message,
    error,
  });
}

module.exports = {
  successResponse,
  createdResponse,
  badRequest,
  notFound,
  serverError,
};
