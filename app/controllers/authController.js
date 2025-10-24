const asyncHandler = require("../middleware/asyncHandler");

class AuthController {
  constructor({ authService, sendSuccess }) {
    this.authService = authService;
    this.sendSuccess = sendSuccess;
  }

  signIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { token, user } = await this.authService.signIn(email, password);
    this.sendSuccess(res, "Signed in successfully.", { token, user });
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    await this.authService.forgotPassword(email);
    this.sendSuccess(res, "Password reset email sent. Check your inbox.", null);
  });

  verifyResetToken = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const user = await this.authService.verifyResetToken(token);
    this.sendSuccess(res, "Token is valid.", user);
  });

  resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await this.authService.resetPassword(token, newPassword);
    this.sendSuccess(res, "Password has been reset successfully.", user);
  });

  changeEmail = asyncHandler(async (req, res) => {
    const { newEmail } = req.body;
    const { id: userId } = req.user;
    const updatedUser = await this.authService.changeEmail(userId, newEmail);
    this.sendSuccess(res, "Email address updated successfully.", updatedUser);
  });
}

module.exports = AuthController;
