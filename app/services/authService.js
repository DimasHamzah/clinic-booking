const crypto = require("crypto");

class AuthService {
  constructor({ userRepository, logger, sendEmail, jwt }) {
    this.userRepository = userRepository;
    this.logger = logger;
    this.sendEmail = sendEmail;
    this.jwt = jwt;
  }

  _generateToken(id) {
    return this.jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
  }

  async _findValidUserByResetToken(token) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          [this.userRepository.userModel.sequelize.Op.gt]: Date.now(),
        },
      },
    });
    return user;
  }

  async signIn(email, password) {
    this.logger.info(`Authentication attempt for email: ${email}`);
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.logger.warn(`Sign-in failed: User with email ${email} not found.`);
      const error = new Error("Invalid credentials.");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      this.logger.warn(`Sign-in failed: Invalid password for email ${email}.`);
      const error = new Error("Invalid credentials.");
      error.statusCode = 401;
      throw error;
    }

    const token = this._generateToken(user.id);
    this.logger.info(`User ${user.username} signed in successfully.`);
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return { token, user: userWithoutPassword };
  }

  async forgotPassword(email) {
    this.logger.info(`Forgot password request for email: ${email}`);
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.logger.warn(
        `Forgot password request for non-existent email: ${email}.`,
      );
      return;
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validate: false });

    const message = `You are receiving this email because you requested a password reset. Please use the following token: ${resetToken}`;

    try {
      await this.sendEmail({
        to: user.email,
        subject: "Password Reset Token",
        text: message,
      });
      this.logger.info(`Password reset email sent to ${user.email}`);
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validate: false });
      this.logger.error(`Error sending password reset email: ${err.message}`);
      const error = new Error("There was an error sending the email.");
      error.statusCode = 500;
      throw error;
    }
  }

  async verifyResetToken(token) {
    this.logger.info("Verifying password reset token.");
    const user = await this._findValidUserByResetToken(token);

    if (!user) {
      this.logger.warn("Invalid or expired password reset token provided.");
      const error = new Error("Invalid or expired token.");
      error.statusCode = 400;
      throw error;
    }

    // eslint-disable-next-line no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async resetPassword(token, newPassword) {
    this.logger.info("Attempting to reset password.");
    const user = await this._findValidUserByResetToken(token);

    if (!user) {
      this.logger.warn("Password reset failed: Invalid or expired token.");
      const error = new Error("Invalid or expired token.");
      error.statusCode = 400;
      throw error;
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    this.logger.info(
      `Password for user ${user.username} has been reset successfully.`,
    );
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async changeEmail(userId, newEmail) {
    this.logger.info(
      `Attempting to change email for user ID: ${userId} to ${newEmail}`,
    );

    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    if (user.email === newEmail) {
      const error = new Error("New email is the same as the current email.");
      error.statusCode = 400;
      throw error;
    }

    const existingUserWithNewEmail =
      await this.userRepository.findByEmail(newEmail);
    if (existingUserWithNewEmail && existingUserWithNewEmail.id !== userId) {
      const error = new Error(
        "This email is already in use by another account.",
      );
      error.statusCode = 409;
      throw error;
    }

    // eslint-disable-next-line no-param-reassign
    user.email = newEmail;
    await user.save();

    this.logger.info(
      `Email for user ID: ${userId} successfully changed to ${newEmail}`,
    );

    // eslint-disable-next-line no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }
}

module.exports = AuthService;
