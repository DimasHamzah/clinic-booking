const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    const error = new Error(errorMessages.join(', '));
    error.statusCode = 400;
    error.errors = errorMessages;
    return next(error);
  }
  return next();
};

const userValidators = { /* ... */ };
const authValidators = { /* ... */ };
const therapistValidators = { /* ... */ };
const serviceValidators = { /* ... */ };

const scheduleValidators = {
  create: [
    body('therapistId', 'Therapist ID is required and must be an integer.').isInt({ min: 1 }),
    body('availableDate', 'Available date is required and must be a valid date.').isISO8601().toDate(),
    body('startTime', 'Start time is required and must be in HH:MM format.').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
    body('endTime', 'End time is required and must be in HH:MM format.').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
    handleValidationErrors,
  ],
  update: [
    body('availableDate', 'Available date must be a valid date.').optional().isISO8601().toDate(),
    body('startTime', 'Start time must be in HH:MM format.').optional().matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
    body('endTime', 'End time must be in HH:MM format.').optional().matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
    body('isAvailable', 'isAvailable must be a boolean.').optional().isBoolean(),
    handleValidationErrors,
  ],
};

module.exports = {
  userValidators,
  authValidators,
  therapistValidators,
  serviceValidators,
  scheduleValidators,
};
