const express = require('express');
const { authValidators } = require('../middleware/validators');

// This factory now accepts the whole container
const createAuthRouter = (container) => {
  // Destructure the required components from the container
  const { authController, protect } = container;

  const router = express.Router();

  router.post('/signin', authValidators.signIn, authController.signIn);
  router.post('/forgot-password', authValidators.forgotPassword, authController.forgotPassword);
  router.get('/verify-reset-token/:token', authController.verifyResetToken);
  router.put('/reset-password/:token', authValidators.resetPassword, authController.resetPassword);
  router.put('/change-email', protect, authController.changeEmail);

  return router;
};

module.exports = createAuthRouter;
