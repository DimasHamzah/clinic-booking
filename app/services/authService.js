const crypto = require('crypto'); // Import crypto for token hashing

class AuthService {
  constructor({ userRepository, logger, sendEmail, jwt }) {
    this.userRepository = userRepository;
    this.logger = logger;
    this.sendEmail = sendEmail;
    this.jwt = jwt;
  }

  /**
   * Generates a JSON Web Token for a user.
   * @param {number} id - The user ID.
   * @returns {string} The generated JWT.
   */
  _generateToken(id) {
    return this.jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
  }

  /**
   * Authenticates a user and returns a JWT.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<{token: string, user: object}>} The JWT and user data.
   * @throws {Error} If credentials are invalid.
   */
  async signIn(email, password) {
    this.logger.info(`Authentication attempt for email: ${email}`);

    // 1. Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.logger.warn(`Sign-in failed: User with email ${email} not found.`);
      const error = new Error('Invalid credentials.');
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    // 2. Validate password
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      this.logger.warn(`Sign-in failed: Invalid password for email ${email}.`);
      const error = new Error('Invalid credentials.');
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    // 3. Generate JWT
    const token = this._generateToken(user.id);

    this.logger.info(`User ${user.username} signed in successfully.`);

    // 4. Return token and user data (without password)
    const { password: _, ...userWithoutPassword } = user.toJSON();

    return { token, user: userWithoutPassword };
  }

  /**
   * Initiates the password reset process by sending a reset token to the user's email.
   * @param {string} email - The user's email address.
   * @returns {Promise<void>} Resolves if the email is sent successfully.
   * @throws {Error} If the user is not found or email sending fails.
   */
  async forgotPassword(email) {
    this.logger.info(`Forgot password request for email: ${email}`);

    // 1. Get user by email
    const user = await this.userRepository.findByEmail(email);

    // IMPORTANT: Do not reveal if the user exists or not for security reasons
    if (!user) {
      this.logger.warn(`Forgot password request for non-existent email: ${email}. Sending generic success.`);
      // Still return success to prevent email enumeration attacks
      return;
    }

    // 2. Generate reset token and save to user
    const resetToken = user.getResetPasswordToken();
    await user.save({ validate: false }); // Save without running validations on other fields

    // 3. Send email with reset token
    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password.\nPlease make a PUT request to: ${resetURL}\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

    try {
      await this.sendEmail({
        to: user.email,
        subject: 'Password Reset Token (Valid for 10 minutes)',
        text: message,
      });
      this.logger.info(`Password reset email sent to ${user.email}`);
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validate: false });
      this.logger.error(`Error sending password reset email to ${user.email}: ${err.message}`);
      const error = new Error('There was an error sending the email. Try again later.');
      error.statusCode = 500;
      throw error;
    }
  }

  /**
   * Verifies a password reset token.
   * @param {string} token - The password reset token received by email.
   * @returns {Promise<object>} The user object (without sensitive data) if token is valid.
   * @throws {Error} If the token is invalid or expired.
   */
  async verifyResetToken(token) {
    this.logger.info('Verifying password reset token.');

    // Hash the token to compare with the one in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // We need access to Sequelize.Op for the comparison, which is available via the model or db object
    // Assuming userRepository has access to the db object or the model itself has Op
    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [this.userRepository.userModel.sequelize.Op.gt]: Date.now() },
      },
    });

    if (!user) {
      this.logger.warn('Invalid or expired password reset token provided.');
      const error = new Error('Invalid or expired token.');
      error.statusCode = 400;
      throw error;
    }

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  /**
   * Resets the user's password using a valid reset token.
   * @param {string} token - The password reset token.
   * @param {string} newPassword - The new password for the user.
   * @returns {Promise<object>} The updated user object (without sensitive data).
   * @throws {Error} If the token is invalid or expired, or password update fails.
   */
  async resetPassword(token, newPassword) {
    this.logger.info('Attempting to reset password.');

    // Hash the token to compare with the one in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [this.userRepository.userModel.sequelize.Op.gt]: Date.now() },
      },
    });

    if (!user) {
      this.logger.warn('Password reset failed: Invalid or expired token.');
      const error = new Error('Invalid or expired token.');
      error.statusCode = 400;
      throw error;
    }

    // Set new password and clear reset token fields
    user.password = newPassword; // The hook in User model will hash this
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save(); // Save will trigger the beforeUpdate hook for password hashing

    this.logger.info(`Password for user ${user.username} has been reset successfully.`);

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  /**
   * Allows a user to change their email address.
   * @param {number} userId - The ID of the user.
   * @param {string} newEmail - The new email address.
   * @returns {Promise<object>} The updated user object (without sensitive data).
   * @throws {Error} If the new email is already in use or user not found.
   */
  async changeEmail(userId, newEmail) {
    this.logger.info(`Attempting to change email for user ID: ${userId} to ${newEmail}`);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    if (user.email === newEmail) {
      const error = new Error('New email is the same as the current email.');
      error.statusCode = 400;
      throw error;
    }

    const existingUserWithNewEmail = await this.userRepository.findByEmail(newEmail);
    if (existingUserWithNewEmail && existingUserWithNewEmail.id !== userId) {
      const error = new Error('This email is already in use by another account.');
      error.statusCode = 409;
      throw error;
    }

    user.email = newEmail;
    await user.save();

    this.logger.info(`Email for user ID: ${userId} successfully changed to ${newEmail}`);

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }
}

module.exports = AuthService;
