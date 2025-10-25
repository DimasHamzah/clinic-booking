const ScheduleService = require('../../services/scheduleService');

const mockScheduleRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

const scheduleService = new ScheduleService({
  scheduleRepository: mockScheduleRepository,
  logger: mockLogger,
});

describe('ScheduleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSchedule', () => {
    it('should create a schedule successfully', async () => {
      const scheduleData = { therapistId: 1, availableDate: '2024-12-31', startTime: '09:00', endTime: '17:00' };
      mockScheduleRepository.create.mockResolvedValue(scheduleData);

      const result = await scheduleService.createSchedule(scheduleData);

      expect(mockScheduleRepository.create).toHaveBeenCalledWith(scheduleData);
      expect(result).toEqual(scheduleData);
    });
  });
});
