class TherapistService {
  constructor({ therapistRepository, userRepository, logger }) {
    this.therapistRepository = therapistRepository;
    this.userRepository = userRepository;
    this.logger = logger;
  }

  /**
   * Creates a new therapist profile.
   * @param {object} therapistData - The data for the new therapist.
   * @returns {Promise<Therapist>} The created therapist profile.
   * @throws {Error} If user does not exist or is already a therapist.
   */
  async createTherapist(therapistData) {
    const { userId, specialization } = therapistData;
    this.logger.info(`Attempting to create therapist profile for user ID: ${userId}`);

    // 1. Check if the user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      this.logger.warn(`Therapist creation failed: User with ID ${userId} not found.`);
      const error = new Error('User not found.');
      error.statusCode = 404; // Not Found
      throw error;
    }

    // 2. Check if the user already has a therapist profile (enforcing one-to-one)
    const existingTherapist = await this.therapistRepository.findByUserId(userId);
    if (existingTherapist) {
      this.logger.warn(`Therapist creation failed: User with ID ${userId} already has a therapist profile.`);
      const error = new Error('This user is already registered as a therapist.');
      error.statusCode = 409; // Conflict
      throw error;
    }

    const newTherapist = await this.therapistRepository.create({ userId, specialization });
    this.logger.info(`Therapist profile created successfully for user ID: ${userId}`);
    return newTherapist;
  }

  /**
   * Retrieves all therapist profiles.
   * @param {object} options - Options for filtering and pagination.
   * @returns {Promise<object>} An object containing therapists and total count.
   */
  async getAllTherapists(options) {
    this.logger.info('Retrieving all therapist profiles.');
    // Include user information in the response
    const queryOptions = {
      ...options,
      include: {
        model: this.userRepository.userModel, // Access the actual model via the repository
        as: 'user',
        attributes: ['id', 'username', 'email', 'displayName', 'phoneNumber'],
      },
    };
    return await this.therapistRepository.findAll(queryOptions);
  }

  /**
   * Retrieves a single therapist profile by ID.
   * @param {number} id - The ID of the therapist profile.
   * @returns {Promise<Therapist|null>} The therapist profile or null if not found.
   */
  async getTherapistById(id) {
    this.logger.info(`Retrieving therapist profile with ID: ${id}`);
    const queryOptions = {
      include: {
        model: this.userRepository.userModel,
        as: 'user',
        attributes: ['id', 'username', 'email', 'displayName', 'phoneNumber'],
      },
    };
    const therapist = await this.therapistRepository.findById(id, queryOptions);
    if (!therapist) {
      this.logger.warn(`Therapist profile with ID ${id} not found.`);
    }
    return therapist;
  }

  /**
   * Updates a therapist profile.
   * @param {number} id - The ID of the therapist profile.
   * @param {object} updateData - The data to update.
   * @returns {Promise<Therapist>} The updated therapist profile.
   * @throws {Error} If therapist profile is not found.
   */
  async updateTherapist(id, updateData) {
    this.logger.info(`Updating therapist profile with ID: ${id}`);

    // Ensure userId cannot be changed
    if (updateData.userId) {
      delete updateData.userId;
      this.logger.warn('Attempted to update userId for a therapist profile, which is not allowed.');
    }

    const updatedTherapist = await this.therapistRepository.update(id, updateData);
    if (!updatedTherapist) {
      this.logger.warn(`Update failed: Therapist profile with ID ${id} not found.`);
      const error = new Error('Therapist profile not found.');
      error.statusCode = 404;
      throw error;
    }

    this.logger.info(`Therapist profile with ID ${id} updated successfully.`);
    return updatedTherapist;
  }

  /**
   * Deletes a therapist profile.
   * @param {number} id - The ID of the therapist profile.
   * @returns {Promise<boolean>} True if deletion was successful.
   * @throws {Error} If therapist profile is not found.
   */
  async deleteTherapist(id) {
    this.logger.info(`Attempting to delete therapist profile with ID: ${id}`);
    const deletedRows = await this.therapistRepository.delete(id);
    if (deletedRows === 0) {
      this.logger.warn(`Deletion failed: Therapist profile with ID ${id} not found.`);
      const error = new Error('Therapist profile not found.');
      error.statusCode = 404;
      throw error;
    }
    this.logger.info(`Therapist profile with ID ${id} deleted successfully.`);
    return true;
  }
}

module.exports = TherapistService;
