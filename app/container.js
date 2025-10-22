const jwt = require('jsonwebtoken');

// Database and Models
const db = require('./db/models'); // Path updated for the new location

// Repositories
const UserRepository = require('./repositories/userRepository');

// Services
const UserService = require('./services/userService');
const AuthService = require('./services/authService');

// Controllers
const UserController = require('./controllers/userController');
const AuthController = require('./controllers/authController');

// Middleware
const createAuthMiddleware = require('./middleware/auth');
const asyncHandler = require('./middleware/asyncHandler');

// Utilities
const logger = require('./config/logger');
const sendEmail = require('./utils/sendEmail');
const { sendSuccess } = require('./utils/response');

// --- Instantiate Repositories ---
const userRepository = new UserRepository({ userModel: db.User });

// --- Instantiate Services ---
const userService = new UserService({ userRepository, logger });
const authService = new AuthService({ userRepository, logger, sendEmail, jwt });

// --- Instantiate Controllers ---
const userController = new UserController({ userService, sendSuccess });
const authController = new AuthController({ authService, sendSuccess });

// --- Instantiate Middleware ---
const { protect, authorize } = createAuthMiddleware({ userRepository, jwt, logger });

// --- Export all instantiated components ---
module.exports = {
  userRepository,
  userService,
  userController,
  authService,
  authController,
  protect,
  authorize,
  logger,
  sendSuccess,
  asyncHandler,
  db, // Export db for server.js to sync
};
