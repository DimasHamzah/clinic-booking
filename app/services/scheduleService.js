class ScheduleService {
  constructor({ scheduleRepository, therapistRepository, logger }) {
    this.scheduleRepository = scheduleRepository;
    this.therapistRepository = therapistRepository; // For accessing Therapist model
    this.logger = logger;
  }

  async createSchedule(scheduleData) {
    this.logger.info('Creating a new schedule');
    // Add logic here to check for overlapping schedules if needed
    const newSchedule = await this.scheduleRepository.create(scheduleData);
    return newSchedule;
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

  async updateSchedule(id, updateData) {
    this.logger.info(`Updating schedule with ID: ${id}`);
    const [affectedRows] = await this.scheduleRepository.update(id, updateData);
    if (affectedRows === 0) {
      const error = new Error('Schedule not found or data is unchanged.');
      error.statusCode = 404;
      throw error;
    }
    return this.getScheduleById(id); // This will now return the schedule with includes
  }

  async deleteSchedule(id) {
    this.logger.info(`Deleting schedule with ID: ${id}`);
    const deletedRows = await this.scheduleRepository.delete(id);
    if (deletedRows === 0) {
      const error = new Error('Schedule not found.');
      error.statusCode = 404;
      throw error;
    }
    return true;
  }
}

module.exports = ScheduleService;
