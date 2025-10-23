const express = require('express');
const createUserRouter = require('./userRoutes');
const createAuthRouter = require('./authRoutes');
const createTherapistRouter = require('./therapistRoutes');
const createServiceRouter = require('./serviceRoutes');

/**
 * Factory function to create the main application router.
 * @param {object} container - The dependency injection container.
 * @returns {express.Router} The configured main router.
 */
const createMainRouter = (container) => {
  const router = express.Router();

  // Destructure all needed components from the container
  const {
    userController,
    authController,
    therapistController,
    serviceController,
    protect,
    authorize,
  } = container;

  // Create sub-routers using their factory functions and injected dependencies
  const authRouter = createAuthRouter({ authController, protect });
  const userRouter = createUserRouter({ userController, protect, authorize });
  const therapistRouter = createTherapistRouter({ therapistController, protect, authorize });
  const serviceRouter = createServiceRouter({ serviceController, protect, authorize });

  // Mount sub-routers
  router.use('/auth', authRouter);
  router.use('/users', userRouter);
  router.use('/therapists', therapistRouter);
  router.use('/services', serviceRouter);

  return router;
};

module.exports = createMainRouter;
