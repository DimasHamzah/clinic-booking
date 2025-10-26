class TherapistService {
  constructor({ therapistRepository, userRepository, logger }) {
    this.therapistRepository = therapistRepository;
    this.userRepository = userRepository;
    this.logger = logger;
  }

  async createTherapist(therapistData) {
    const { userId, specialization } = therapistData;
    this.logger.info(
      `Attempting to create therapist profile for user ID: ${userId}`,
    );

    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    const existingTherapist =
      await this.therapistRepository.findByUserId(userId);
    if (existingTherapist) {
      const error = new Error(
        "This user is already registered as a therapist.",
      );
      error.statusCode = 409;
      throw error;
    }

    const newTherapist = await this.therapistRepository.create({
      userId,
      specialization,
    });
    this.logger.info(
      `Therapist profile created successfully for user ID: ${userId}`,
    );
    return newTherapist;
  }

  async getAllTherapists(options) {
    this.logger.info("Retrieving all therapist profiles.");
    const queryOptions = {
      ...options,
      include: {
        association: "user",
        attributes: ["id", "username", "email", "displayName", "phoneNumber"],
      },
    };
    return this.therapistRepository.findAll(queryOptions);
  }

  async getTherapistById(id) {
    this.logger.info(`Retrieving therapist profile with ID: ${id}`);
    const queryOptions = {
      include: {
        association: "user",
        attributes: ["id", "username", "email", "displayName", "phoneNumber"],
      },
    };
    const therapist = await this.therapistRepository.findById(id, queryOptions);
    if (!therapist) {
      const error = new Error("Therapist profile not found.");
      error.statusCode = 404;
      throw error;
    }
    return therapist;
  }

  async updateTherapist(id, updateData) {
    this.logger.info(`Updating therapist profile with ID: ${id}`);
    const dataToUpdate = { ...updateData };
    if (dataToUpdate.userId) {
      delete dataToUpdate.userId;
      this.logger.warn(
        "Attempted to update userId for a therapist profile, which is not allowed.",
      );
    }

    const updatedTherapist = await this.therapistRepository.update(
      id,
      dataToUpdate,
    );
    if (!updatedTherapist) {
      const error = new Error("Therapist profile not found.");
      error.statusCode = 404;
      throw error;
    }

    this.logger.info(`Therapist profile with ID ${id} updated successfully.`);
    return updatedTherapist;
  }

  async deleteTherapist(id) {
    this.logger.info(`Attempting to delete therapist profile with ID: ${id}`);
    const deletedRows = await this.therapistRepository.delete(id);
    if (deletedRows === 0) {
      const error = new Error("Therapist profile not found.");
      error.statusCode = 404;
      throw error;
    }
    this.logger.info(`Therapist profile with ID ${id} deleted successfully.`);
    return true;
  }
}

module.exports = TherapistService;
