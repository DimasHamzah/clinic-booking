class TherapistService {
  constructor({ therapistRepository, userRepository, logger }) {
    this.therapistRepository = therapistRepository;
    this.userRepository = userRepository;
    this.logger = logger;
  }

  async createTherapist(therapistData) {
    // ... (method remains the same)
  }

  async getAllTherapists(options) {
    this.logger.info('Retrieving all therapist profiles.');
    const queryOptions = {
      ...options,
      include: {
        association: 'user', // Use the alias of the association
        attributes: ['id', 'username', 'email', 'displayName', 'phoneNumber'],
      },
    };
    return this.therapistRepository.findAll(queryOptions);
  }

  async getTherapistById(id) {
    this.logger.info(`Retrieving therapist profile with ID: ${id}`);
    const queryOptions = {
      include: {
        association: 'user', // Use the alias of the association
        attributes: ['id', 'username', 'email', 'displayName', 'phoneNumber'],
      },
    };
    const therapist = await this.therapistRepository.findById(id, queryOptions);
    if (!therapist) {
      const error = new Error('Therapist profile not found.');
      error.statusCode = 404;
      throw error;
    }
    return therapist;
  }

  // ... other methods remain the same
}

module.exports = TherapistService;
