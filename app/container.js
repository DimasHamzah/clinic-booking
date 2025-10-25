const jwt = require('jsonwebtoken');
const db = require('./db/models');
const logger = require('./config/logger');
const { sendSuccess } = require('./utils/response');
const sendEmail = require('./utils/sendEmail');
const createAuthMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const UserRepository = require('./repositories/userRepository');
const TherapistRepository = require('./repositories/therapistRepository');
const ServiceRepository = require('./repositories/serviceRepository');
const ScheduleRepository = require('./repositories/scheduleRepository');

const AuthService = require('./services/authService');
const UserService = require('./services/userService');
const TherapistService = require('./services/therapistService');
const ServiceService = require('./services/serviceService');
const ScheduleService = require('./services/scheduleService');

const AuthController = require('./controllers/authController');
const UserController = require('./controllers/userController');
const TherapistController = require('./controllers/therapistController');
const ServiceController = require('./controllers/serviceController');
const ScheduleController = require('./controllers/scheduleController');

const userRepository = new UserRepository({ userModel: db.User });
const therapistRepository = new TherapistRepository({ therapistModel: db.Therapist });
const serviceRepository = new ServiceRepository({ serviceModel: db.Service });
const scheduleRepository = new ScheduleRepository({ scheduleModel: db.Schedule });

const authService = new AuthService({ userRepository, logger, sendEmail, jwt });
const userService = new UserService({ userRepository, logger });
const therapistService = new TherapistService({ therapistRepository, userRepository, logger });
const serviceService = new ServiceService({ serviceRepository, logger });
const scheduleService = new ScheduleService({ scheduleRepository, therapistRepository, logger }); // Updated dependencies

const authController = new AuthController({ authService, sendSuccess });
const userController = new UserController({ userService, sendSuccess });
const therapistController = new TherapistController({ therapistService, sendSuccess });
const serviceController = new ServiceController({ serviceService, sendSuccess });
const scheduleController = new ScheduleController({ scheduleService, sendSuccess });

const { protect, authorize } = createAuthMiddleware({ userRepository, jwt, logger });

module.exports = {
  db,
  logger,
  protect,
  authorize,
  errorHandler,
  authController,
  userController,
  therapistController,
  serviceController,
  scheduleController,
};
