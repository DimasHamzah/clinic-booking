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

// Validation rules for creating a user
const createUserValidator = [
  body('username', 'Username is required and cannot be empty.').notEmpty().trim(),
  body('email', 'Please provide a valid email address.').isEmail().normalizeEmail(),
  body('password', 'Password is required and must be at least 8 characters long.').isLength({ min: 8 }),
  body('displayName', 'Display name is required.').notEmpty().trim(),
  body('role', 'Invalid role specified.').optional().isIn(['CUSTOMER', 'STAFF', 'ADMIN']),
  handleValidationErrors,
];

// Validation rules for user sign-in
const signInValidator = [
  body('email', 'Please provide a valid email address.').isEmail().normalizeEmail(),
  body('password', 'Password cannot be empty.').notEmpty(),
  handleValidationErrors,
];

// Validation rules for forgot password
const forgotPasswordValidator = [
  body('email', 'Please provide a valid email address.').isEmail().normalizeEmail(),
  handleValidationErrors,
];

// Validation rules for reset password
const resetPasswordValidator = [
  body('newPassword', 'New password is required and must be at least 8 characters long.').isLength({ min: 8 }),
  handleValidationErrors,
];

// Validation rules for change email
const changeEmailValidator = [
  body('newEmail', 'Please provide a valid new email address.').isEmail().normalizeEmail(),
  handleValidationErrors,
];

module.exports = {
  createUserValidator,
  signInValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changeEmailValidator,
};
