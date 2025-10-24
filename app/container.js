const jwt = require("jsonwebtoken");

// Core
const db = require("./db/models");
const logger = require("./config/logger");
const { sendSuccess } = require("./utils/response");
const sendEmail = require("./utils/sendEmail");
const createAuthMiddleware = require("./middleware/auth");

// Repositories
const UserRepository = require("./repositories/userRepository");
const TherapistRepository = require("./repositories/therapistRepository");
const ServiceRepository = require("./repositories/serviceRepository");

// Services
const AuthService = require("./services/authService");
const UserService = require("./services/userService");
const TherapistService = require("./services/therapistService");
const ServiceService = require("./services/serviceService");

// Controllers
const AuthController = require("./controllers/authController");
const UserController = require("./controllers/userController");
const TherapistController = require("./controllers/therapistController");
const ServiceController = require("./controllers/serviceController");

// --- Repositories ---
const userRepository = new UserRepository({ userModel: db.User });
const therapistRepository = new TherapistRepository({
  therapistModel: db.Therapist,
});
const serviceRepository = new ServiceRepository({ serviceModel: db.Service });

// --- Services ---
const authService = new AuthService({ userRepository, logger, sendEmail, jwt });
const userService = new UserService({ userRepository, logger });
const therapistService = new TherapistService({
  therapistRepository,
  userRepository,
  logger,
});
const serviceService = new ServiceService({ serviceRepository, logger });

// --- Controllers ---
const authController = new AuthController({ authService, sendSuccess });
const userController = new UserController({ userService, sendSuccess });
const therapistController = new TherapistController({
  therapistService,
  sendSuccess,
});
const serviceController = new ServiceController({
  serviceService,
  sendSuccess,
});

// --- Middleware ---
const { protect, authorize } = createAuthMiddleware({
  userRepository,
  jwt,
  logger,
});

module.exports = {
  // Core
  db,
  logger,
  sendSuccess,
  protect,
  authorize,

  // Features
  auth: {
    repository: null, // Auth doesn't have a dedicated repository
    service: authService,
    controller: authController,
  },
  users: {
    repository: userRepository,
    service: userService,
    controller: userController,
  },
  therapists: {
    repository: therapistRepository,
    service: therapistService,
    controller: therapistController,
  },
  services: {
    repository: serviceRepository,
    service: serviceService,
    controller: serviceController,
  },
};
