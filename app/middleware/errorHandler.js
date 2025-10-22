const logger = require('../config/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log the error for the developer
  logger.error(
    `${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  // Handle Sequelize Unique Constraint Error (e.g., duplicate email or username)
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = `The value for '${err.errors[0].path}' is already in use.`;
    error = { statusCode: 409, message, success: false, status: 'conflict' };
  }

  // Handle Sequelize Validation Error (e.g., password too short, email invalid)
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message);
    const message = `Validation failed: ${messages.join(', ')}`;
    error = { statusCode: 400, message, success: false, status: 'bad_request', errors: messages };
  }

  const statusCode = error.statusCode || 500;
  const responseStatus = error.status || 'error';

  const response = {
    success: false,
    status: responseStatus,
    message: error.message || 'An unexpected error occurred.',
    ...(error.errors && { errors: error.errors }), // Include specific validation errors if they exist
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Include stack trace in development
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
