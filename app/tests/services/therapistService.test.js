const TherapistService = require('../../services/therapistService');

const mockTherapistRepository = {
  create: jest.fn(),
  findByUserId: jest.fn(),
  delete: jest.fn(),
};
const mockUserRepository = {
  findById: jest.fn(),
};
const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
};

const therapistService = new TherapistService({
  therapistRepository: mockTherapistRepository,
  userRepository: mockUserRepository,
  logger: mockLogger,
});

describe('TherapistService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTherapist', () => {
    it('should create a therapist profile successfully', async () => {
      const therapistData = { userId: 1, specialization: 'Facials' };
      mockUserRepository.findById.mockResolvedValue({ id: 1 });
      mockTherapistRepository.findByUserId.mockResolvedValue(null);
      mockTherapistRepository.create.mockResolvedValue({ id: 10, ...therapistData });

      await therapistService.createTherapist(therapistData);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(mockTherapistRepository.create).toHaveBeenCalledWith(therapistData);
    });

    it('should throw a 404 error if the user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(therapistService.createTherapist({ userId: 99, specialization: 'Facials' })).rejects.toThrow('User not found');
    });

    it('should throw a 409 error if the user is already a therapist', async () => {
      mockUserRepository.findById.mockResolvedValue({ id: 1 });
      mockTherapistRepository.findByUserId.mockResolvedValue({ id: 10 });
      await expect(therapistService.createTherapist({ userId: 1, specialization: 'Facials' })).rejects.toThrow('This user is already registered as a therapist');
    });
  });

  describe('deleteTherapist', () => {
    it('should delete a therapist profile successfully', async () => {
      mockTherapistRepository.delete.mockResolvedValue(1);
      await expect(therapistService.deleteTherapist(10)).resolves.toBe(true);
    });

    it('should throw a 404 error if the therapist profile to delete is not found', async () => {
      mockTherapistRepository.delete.mockResolvedValue(0);
      await expect(therapistService.deleteTherapist(99)).rejects.toThrow('Therapist profile not found');
    });
  });
});
