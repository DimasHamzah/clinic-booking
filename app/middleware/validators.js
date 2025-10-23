const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors from express-validator
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    const error = new Error(errorMessages.join(', '));
    error.statusCode = 400;
    error.errors = errorMessages;
    return next(error);
  }
  next();
};

// --- User Validators ---
const createUserValidator = [
  body('username', 'Username is required and cannot be empty.').notEmpty().trim(),
  body('email', 'Please provide a valid email address.').isEmail().normalizeEmail(),
  body('password', 'Password is required and must be at least 8 characters long.').isLength({ min: 8 }),
  body('displayName', 'Display name is required.').notEmpty().trim(),
  body('role', 'Invalid role specified.').optional().isIn(['CUSTOMER', 'STAFF', 'ADMIN']),
  handleValidationErrors,
];

// --- Auth Validators ---
const signInValidator = [
  body('email', 'Please provide a valid email address.').isEmail().normalizeEmail(),
  body('password', 'Password cannot be empty.').notEmpty(),
  handleValidationErrors,
];

const forgotPasswordValidator = [
  body('email', 'Please provide a valid email address.').isEmail().normalizeEmail(),
  handleValidationErrors,
];

const resetPasswordValidator = [
  body('newPassword', 'New password is required and must be at least 8 characters long.').isLength({ min: 8 }),
  handleValidationErrors,
];

const changeEmailValidator = [
  body('newEmail', 'Please provide a valid new email address.').isEmail().normalizeEmail(),
  handleValidationErrors,
];

// --- Therapist Validators ---
const createTherapistValidator = [
  body('userId', 'User ID is required and must be an integer.').isInt({ min: 1 }),
  body('specialization', 'Specialization is required and cannot be empty.').notEmpty().trim(),
  handleValidationErrors,
];

const updateTherapistValidator = [
  body('specialization', 'Specialization cannot be empty.').optional().notEmpty().trim(),
  body('rating', 'Rating must be a float between 0 and 5.').optional().isFloat({ min: 0, max: 5 }),
  body('isActive', 'isActive must be a boolean.').optional().isBoolean().toBoolean(),
  body('userId', 'User ID cannot be updated.').not().exists(),
  handleValidationErrors,
];

// --- Service Validators ---
const createServiceValidator = [
  body('name', 'Service name is required.').notEmpty().trim(),
  body('description', 'Description is required.').notEmpty().trim(),
  body('duration_minutes', 'Duration is required and must be an integer.').isInt({ min: 1 }),
  body('price', 'Price is required and must be a valid decimal number.').isDecimal({ decimal_digits: '1,2' }),
  handleValidationErrors,
];

const updateServiceValidator = [
  body('name', 'Service name cannot be empty.').optional().notEmpty().trim(),
  body('description', 'Description cannot be empty.').optional().notEmpty().trim(),
  body('duration_minutes', 'Duration must be an integer.').optional().isInt({ min: 1 }),
  body('price', 'Price must be a valid decimal number.').optional().isDecimal({ decimal_digits: '1,2' }),
  body('isActive', 'isActive must be a boolean.').optional().isBoolean(),
  handleValidationErrors,
];

module.exports = {
  createUserValidator,
  signInValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changeEmailValidator,
  createTherapistValidator,
  updateTherapistValidator,
  createServiceValidator,
  updateServiceValidator,
};
