const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    const error = new Error(errorMessages.join(", "));
    error.statusCode = 400;
    error.errors = errorMessages;
    return next(error);
  }
  return next();
};

const userValidators = {
  create: [
    body("username", "Username is required.").notEmpty().trim(),
    body("email", "Please provide a valid email.").isEmail().normalizeEmail(),
    body("password", "Password must be at least 8 characters.").isLength({
      min: 8,
    }),
    body("displayName", "Display name is required.").notEmpty().trim(),
    handleValidationErrors,
  ],
};

const authValidators = {
  signIn: [
    body("email", "Please provide a valid email.").isEmail().normalizeEmail(),
    body("password", "Password cannot be empty.").notEmpty(),
    handleValidationErrors,
  ],
  forgotPassword: [
    body("email", "Please provide a valid email.").isEmail().normalizeEmail(),
    handleValidationErrors,
  ],
  resetPassword: [
    body("newPassword", "Password must be at least 8 characters.").isLength({
      min: 8,
    }),
    handleValidationErrors,
  ],
  changeEmail: [
    body("newEmail", "Please provide a valid new email address.")
      .isEmail()
      .normalizeEmail(),
    handleValidationErrors,
  ],
};

const therapistValidators = {
  create: [
    body("userId", "User ID is required and must be an integer.").isInt({
      min: 1,
    }),
    body("specialization", "Specialization is required.").notEmpty().trim(),
    handleValidationErrors,
  ],
  update: [
    body("specialization", "Specialization cannot be empty.")
      .optional()
      .notEmpty()
      .trim(),
    body("isActive", "isActive must be a boolean.").optional().isBoolean(),
    body("userId", "User ID cannot be updated.").not().exists(),
    handleValidationErrors,
  ],
};

const serviceValidators = {
  create: [
    body("name", "Service name is required.").notEmpty().trim(),
    body("description", "Description is required.").notEmpty().trim(),
    body("duration_minutes", "Duration must be an integer.").isInt({ min: 1 }),
    body("price", "Price is required.").isDecimal({ decimal_digits: "1,2" }),
    handleValidationErrors,
  ],
  update: [
    body("name", "Service name cannot be empty.").optional().notEmpty().trim(),
    body("duration_minutes", "Duration must be an integer.")
      .optional()
      .isInt({ min: 1 }),
    body("price", "Price must be a valid decimal.")
      .optional()
      .isDecimal({ decimal_digits: "1,2" }),
    body("isActive", "isActive must be a boolean.").optional().isBoolean(),
    handleValidationErrors,
  ],
};

const scheduleValidators = {
  create: [
    body(
      "therapistId",
      "Therapist ID is required and must be an integer.",
    ).isInt({ min: 1 }),
    body(
      "availableDate",
      "Available date is required and must be a valid date.",
    )
      .isISO8601()
      .toDate(),
    body(
      "startTime",
      "Start time is required and must be in HH:MM format.",
    ).matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
    body(
      "endTime",
      "End time is required and must be in HH:MM format.",
    ).matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
    handleValidationErrors,
  ],
  update: [
    body("availableDate", "Available date must be a valid date.")
      .optional()
      .isISO8601()
      .toDate(),
    body("startTime", "Start time must be in HH:MM format.")
      .optional()
      .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
    body("endTime", "End time must be in HH:MM format.")
      .optional()
      .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
    body("isAvailable", "isAvailable must be a boolean.")
      .optional()
      .isBoolean(),
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
