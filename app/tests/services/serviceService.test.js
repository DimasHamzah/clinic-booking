const ServiceService = require('../../services/serviceService');

const mockServiceRepository = {
  findById: jest.fn(),
};

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
};

const serviceService = new ServiceService({
  serviceRepository: mockServiceRepository,
  logger: mockLogger,
});

describe('ServiceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getServiceById', () => {
    it('should throw an error if service not found', async () => {
      mockServiceRepository.findById.mockResolvedValue(null);
      await expect(serviceService.getServiceById(999)).rejects.toThrow('Service not found.');
    });
  });
});
