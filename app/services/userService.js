class UserService {
  constructor({ userRepository, logger }) {
    this.userRepository = userRepository;
    this.logger = logger;
  }

  async createUser(userData) {
    this.logger.info(`Attempting to create user: ${userData.username}`);

    const existingUserByUsername = await this.userRepository.findByUsername(userData.username);
    if (existingUserByUsername) {
      this.logger.warn(`User creation failed: Username ${userData.username} already exists.`);
      const error = new Error('Username already exists.');
      error.statusCode = 409; // Conflict
      throw error;
    }

    const existingUserByEmail = await this.userRepository.findByEmail(userData.email);
    if (existingUserByEmail) {
      this.logger.warn(`User creation failed: Email ${userData.email} already in use.`);
      const error = new Error('Email already in use.');
      error.statusCode = 409; // Conflict
      throw error;
    }

    const user = await this.userRepository.create(userData);
    this.logger.info(`User ${user.username} created successfully.`);
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async getUserById(id) {
    this.logger.info(`Attempting to retrieve user with ID: ${id}`);
    const user = await this.userRepository.findById(id);
    if (!user) {
      this.logger.warn(`User with ID ${id} not found.`);
      return null;
    }
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async getAllUsers(options) {
    this.logger.info('Attempting to retrieve all users.');
    const { rows, count } = await this.userRepository.findAll(options);
    const usersWithoutPasswords = rows.map(user => {
      const { password, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    });
    return { users: usersWithoutPasswords, total: count };
  }

  async updateUser(id, updateData) {
    this.logger.info(`Attempting to update user with ID: ${id}`);

    const user = await this.userRepository.findById(id);
    if (!user) {
      this.logger.warn(`User update failed: User with ID ${id} not found.`);
      const error = new Error('User not found.');
      error.statusCode = 404; // Not Found
      throw error;
    }

    if (updateData.username && updateData.username !== user.username) {
      const existingUserByUsername = await this.userRepository.findByUsername(updateData.username);
      if (existingUserByUsername && existingUserByUsername.id !== id) {
        this.logger.warn(`User update failed: Username ${updateData.username} already exists for another user.`);
        const error = new Error('Username already exists.');
        error.statusCode = 409; // Conflict
        throw error;
      }
    }

    if (updateData.email && updateData.email !== user.email) {
      const existingUserByEmail = await this.userRepository.findByEmail(updateData.email);
      if (existingUserByEmail && existingUserByEmail.id !== id) {
        this.logger.warn(`User update failed: Email ${updateData.email} already in use by another user.`);
        const error = new Error('Email already in use.');
        error.statusCode = 409; // Conflict
        throw error;
      }
    }

    const updatedUser = await this.userRepository.update(id, updateData);
    if (!updatedUser) {
      this.logger.error(`Failed to update user with ID: ${id} after validation.`);
      const error = new Error('Failed to update user.');
      error.statusCode = 500; // Internal Server Error
      throw error;
    }
    const { password, ...userWithoutPassword } = updatedUser.toJSON();
    this.logger.info(`User with ID ${id} updated successfully.`);
    return userWithoutPassword;
  }

  async deleteUser(id) {
    this.logger.info(`Attempting to delete user with ID: ${id}`);
    const deletedRows = await this.userRepository.delete(id);
    if (deletedRows === 0) {
      this.logger.warn(`User deletion failed: User with ID ${id} not found.`);
      const error = new Error('User not found.');
      error.statusCode = 404; // Not Found
      throw error;
    }
    this.logger.info(`User with ID ${id} deleted successfully.`);
    return true;
  }
}

module.exports = UserService;
