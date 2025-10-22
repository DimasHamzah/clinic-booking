const jwt = require('jsonwebtoken');

// Database and Models
const db = require('./db/models');

// Repositories
const UserRepository = require('./repositories/userRepository');
const TherapistRepository = require('./repositories/therapistRepository');

// Services
const UserService = require('./services/userService');
const AuthService = require('./services/authService');
const TherapistService = require('./services/therapistService');

// Controllers
const UserController = require('./controllers/userController');
const AuthController = require('./controllers/authController');
const TherapistController = require('./controllers/therapistController');

// Middleware
const createAuthMiddleware = require('./middleware/auth');

// Utilities
const logger = require('./config/logger');
const sendEmail = require('./utils/sendEmail');
const { sendSuccess } = require('./utils/response');

// --- Instantiate Repositories ---
const userRepository = new UserRepository({ userModel: db.User });
const therapistRepository = new TherapistRepository({ therapistModel: db.Therapist });

// --- Instantiate Services ---
const userService = new UserService({ userRepository, logger });
const authService = new AuthService({ userRepository, logger, sendEmail, jwt });
const therapistService = new TherapistService({ therapistRepository, userRepository, logger });

// --- Instantiate Controllers ---
const userController = new UserController({ userService, sendSuccess });
const authController = new AuthController({ authService, sendSuccess });
const therapistController = new TherapistController({ therapistService, sendSuccess });

// --- Instantiate Middleware ---
const { protect, authorize } = createAuthMiddleware({ userRepository, jwt, logger });

// --- Export all instantiated components ---
module.exports = {
  // Core
  db,
  logger,
  sendSuccess,
  protect,
  authorize,

  // User Feature
  userRepository,
  userService,
  userController,

  // Auth Feature
  authService,
  authController,

  // Therapist Feature
  therapistRepository,
  therapistService,
  therapistController,
};
