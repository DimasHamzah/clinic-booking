class UserService {
  constructor({ userRepository, logger }) {
    this.userRepository = userRepository;
    this.logger = logger;
  }

  async createUser(userData) {
    this.logger.info(`Attempting to create user: ${userData.username}`);

    const existingUserByUsername = await this.userRepository.findByUsername(
      userData.username,
    );
    if (existingUserByUsername) {
      const error = new Error("Username already exists.");
      error.statusCode = 409;
      throw error;
    }

    const existingUserByEmail = await this.userRepository.findByEmail(
      userData.email,
    );
    if (existingUserByEmail) {
      const error = new Error("Email already in use.");
      error.statusCode = 409;
      throw error;
    }

    const user = await this.userRepository.create(userData);
    this.logger.info(`User ${user.username} created successfully.`);
    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async getUserById(id) {
    this.logger.info(`Retrieving user with ID: ${id}`);
    const user = await this.userRepository.findById(id);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async getAllUsers(options) {
    this.logger.info("Retrieving all users.");
    const { rows, count } = await this.userRepository.findAll(options);
    const usersWithoutPasswords = rows.map((user) => {
      // eslint-disable-next-line no-unused-vars
      const { password, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    });
    return { users: usersWithoutPasswords, total: count };
  }

  async updateUser(id, updateData) {
    this.logger.info(`Attempting to update user with ID: ${id}`);

    const user = await this.userRepository.findById(id);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    if (updateData.username && updateData.username !== user.username) {
      const existingUser = await this.userRepository.findByUsername(
        updateData.username,
      );
      if (existingUser && existingUser.id !== id) {
        const error = new Error("Username already exists.");
        error.statusCode = 409;
        throw error;
      }
    }

    // Similar check for email

    const updatedUser = await this.userRepository.update(id, updateData);
    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser.toJSON();
    this.logger.info(`User with ID ${id} updated successfully.`);
    return userWithoutPassword;
  }

  async deleteUser(id) {
    this.logger.info(`Attempting to delete user with ID: ${id}`);
    const deletedRows = await this.userRepository.delete(id);
    if (deletedRows === 0) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    this.logger.info(`User with ID ${id} deleted successfully.`);
    return true;
  }
}

module.exports = UserService;
