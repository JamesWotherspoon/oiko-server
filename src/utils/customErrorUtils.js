class CustomError extends Error {
  constructor(message, type, statusCode, originalError) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends CustomError {
  constructor(message = 'Bad Request', type, originalError) {
    super(message, type, 400, originalError);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized', type, originalError) {
    super(message, type, 401, originalError);
  }
}

class DomainError extends CustomError {
  constructor(message, type, statusCode = 400) {
    super(message, type, statusCode);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden', type, originalError) {
    super(message, type, 403, originalError);
  }
}

class AuthenticationError extends CustomError {
  constructor(message = 'Authentication failed', type) {
    super(message, type, 401);
  }
}

class NotFoundError extends CustomError {
  constructor(message = 'Not Found', type = 'NOT_FOUND', originalError) {
    super(message, type, 404, originalError);
  }
}

class InternalServerError extends CustomError {
  constructor(message = 'Internal Server Error', type = 'INTERNAL_SERVER_ERROR', originalError) {
    super(message, type, 500, originalError);
  }
}

class RateLimitError extends CustomError {
  constructor(message = 'Too Many Requests', type = 'TOO_MANY_REQUESTS', originalError) {
    super(message, type, 429, originalError);
  }
}

const throwIfCustomError = (error) => {
  // If the error is a custom error, throw it
  if (error instanceof CustomError) {
    throw error;
  }
};

module.exports = {
  CustomError,
  BadRequestError,
  DomainError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
  RateLimitError,
  AuthenticationError,
  throwIfCustomError,
};
