const asyncHandler = require('../middleware/asyncHandler');

class AuthController {
  constructor({ authService, sendSuccess }) {
    this.authService = authService;
    this.sendSuccess = sendSuccess;
  }

  /**
   * Handles user sign-in.
   */
  signIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Please provide an email and password.');
      error.statusCode = 400; // Bad Request
      throw error;
    }

    const { token, user } = await this.authService.signIn(email, password);

    this.sendSuccess(res, 'Signed in successfully.', { token, user });
  });

  /**
   * Handles the request to send a password reset email.
   */
  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      const error = new Error('Please provide an email address.');
      error.statusCode = 400;
      throw error;
    }

    await this.authService.forgotPassword(email);
    this.sendSuccess(res, 'Password reset email sent. Check your inbox.', null);
  });

  /**
   * Handles the verification of a password reset token.
   */
  verifyResetToken = asyncHandler(async (req, res) => {
    const { token } = req.params;

    if (!token) {
      const error = new Error('Password reset token is missing.');
      error.statusCode = 400;
      throw error;
    }

    const user = await this.authService.verifyResetToken(token);
    this.sendSuccess(res, 'Token is valid.', user);
  });

  /**
   * Handles the actual password reset.
   */
  resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      const error = new Error('Token and new password are required.');
      error.statusCode = 400;
      throw error;
    }

    // Basic password length validation (more robust validation can be added here)
    if (newPassword.length < 8) {
      const error = new Error('Password must be at least 8 characters long.');
      error.statusCode = 400;
      throw error;
    }

    const user = await this.authService.resetPassword(token, newPassword);
    this.sendSuccess(res, 'Password has been reset successfully.', user);
  });

  /**
   * Handles changing a user's email address.
   */
  changeEmail = asyncHandler(async (req, res) => {
    const { newEmail } = req.body;
    const userId = req.user.id; // Assuming req.user is populated by protect middleware

    if (!newEmail) {
      const error = new Error('New email address is required.');
      error.statusCode = 400;
      throw error;
    }

    const updatedUser = await this.authService.changeEmail(userId, newEmail);
    this.sendSuccess(res, 'Email address updated successfully.', updatedUser);
  });
}

module.exports = AuthController;
