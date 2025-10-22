const express = require('express');
const {
  signInValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changeEmailValidator,
} = require('../middleware/validators');

/**
 * Factory function to create the authentication router.
 * @param {object} dependencies - The dependencies for the router.
 * @param {object} dependencies.authController - The authentication controller.
 * @param {function} dependencies.protect - The protect middleware.
 * @returns {express.Router} The configured authentication router.
 */
const createAuthRouter = ({ authController, protect }) => {
  const router = express.Router();

  router.post('/signin', signInValidator, authController.signIn);

  router.post('/forgot-password', forgotPasswordValidator, authController.forgotPassword);

  router.get('/verify-reset-token/:token', authController.verifyResetToken);

  router.put('/reset-password/:token', resetPasswordValidator, authController.resetPassword);

  router.put('/change-email', protect, changeEmailValidator, authController.changeEmail);

  return router;
};

module.exports = createAuthRouter;
