const express = require('express');

/**
 * Factory function to create the main application router.
 * @param {object} dependencies - The dependencies for the main router.
 * @param {function} dependencies.createUserRouter - Factory function for user routes.
 * @param {function} dependencies.createAuthRouter - Factory function for auth routes.
 * @param {object} dependencies.userController - The user controller instance.
 * @param {object} dependencies.authController - The auth controller instance.
 * @param {function} dependencies.protect - The protect middleware.
 * @param {function} dependencies.authorize - The authorize middleware.
 * @returns {express.Router} The configured main router.
 */
const createMainRouter = ({ createUserRouter, createAuthRouter, userController, authController, protect, authorize }) => {
  const router = express.Router();

  // Create sub-routers using their factory functions and injected dependencies
  const userRouter = createUserRouter({ userController, protect, authorize });
  const authRouter = createAuthRouter({ authController, protect });

  // Mount sub-routers
  router.use('/users', userRouter);
  router.use('/auth', authRouter);

  return router;
};

module.exports = createMainRouter;
