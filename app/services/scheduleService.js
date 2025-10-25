class ScheduleService {
  constructor({ scheduleRepository, logger }) {
    this.scheduleRepository = scheduleRepository;
    this.logger = logger;
  }

  async createSchedule(scheduleData) {
    // ... (method remains the same)
  }

  async getAllSchedules(options) {
    this.logger.info('Retrieving all schedules with therapist details');
    const queryOptions = {
      ...options,
      include: [
        {
          association: 'therapist', // Include the therapist profile
          include: {
            association: 'user', // Nested include for the user
            attributes: ['id', 'displayName', 'email'],
          },
        },
      ],
    };
    return this.scheduleRepository.findAll(queryOptions);
  }

  async getScheduleById(id) {
    this.logger.info(`Retrieving schedule with ID: ${id}`);
    const queryOptions = {
      include: [
        {
          association: 'therapist',
          include: {
            association: 'user',
            attributes: ['id', 'displayName', 'email'],
          },
        },
      ],
    };
    const schedule = await this.scheduleRepository.findById(id, queryOptions);
    if (!schedule) {
      const error = new Error('Schedule not found.');
      error.statusCode = 404;
      throw error;
    }
    return schedule;
  }

  // ... other methods remain the same
}

module.exports = ScheduleService;
