const TherapistService = require('../../services/therapistService');

// --- Mock Dependencies ---
const mockTherapistRepository = {
  create: jest.fn(),
  findByUserId: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockUserRepository = {
  findById: jest.fn(),
  userModel: { /* Mock any needed model properties if necessary */ },
};

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// --- Instantiate the Service with Mocks ---
const therapistService = new TherapistService({
  therapistRepository: mockTherapistRepository,
  userRepository: mockUserRepository,
  logger: mockLogger,
});

describe('TherapistService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Test for createTherapist ---
  describe('createTherapist', () => {
    it('should create a therapist profile successfully', async () => {
      const therapistData = { userId: 1, specialization: 'Facials' };
      const mockUser = { id: 1, username: 'testuser' };
      const mockCreatedTherapist = { id: 10, ...therapistData };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockTherapistRepository.findByUserId.mockResolvedValue(null);
      mockTherapistRepository.create.mockResolvedValue(mockCreatedTherapist);

      const result = await therapistService.createTherapist(therapistData);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(mockTherapistRepository.findByUserId).toHaveBeenCalledWith(1);
      expect(mockTherapistRepository.create).toHaveBeenCalledWith(therapistData);
      expect(result).toEqual(mockCreatedTherapist);
    });

    it('should throw a 404 error if the user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(therapistService.createTherapist({ userId: 99, specialization: 'Facials' })).rejects.toThrow('User not found');
    });

    it('should throw a 409 error if the user is already a therapist', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockTherapistRepository.findByUserId.mockResolvedValue({ id: 10, userId: 1 });

      await expect(therapistService.createTherapist({ userId: 1, specialization: 'Facials' })).rejects.toThrow('This user is already registered as a therapist.');
    });
  });

  // --- Test for getTherapistById ---
  describe('getTherapistById', () => {
    it('should return a therapist profile with user data', async () => {
      const mockTherapist = { id: 10, userId: 1, specialization: 'Facials' };
      mockTherapistRepository.findById.mockResolvedValue(mockTherapist);

      const result = await therapistService.getTherapistById(10);

      expect(mockTherapistRepository.findById).toHaveBeenCalledWith(10, expect.any(Object));
      expect(result).toEqual(mockTherapist);
    });
  });

  // --- Test for deleteTherapist ---
  describe('deleteTherapist', () => {
    it('should delete a therapist profile successfully', async () => {
      mockTherapistRepository.delete.mockResolvedValue(1); // 1 row affected

      const result = await therapistService.deleteTherapist(10);

      expect(mockTherapistRepository.delete).toHaveBeenCalledWith(10);
      expect(result).toBe(true);
    });

    it('should throw a 404 error if the therapist profile to delete is not found', async () => {
      mockTherapistRepository.delete.mockResolvedValue(0); // 0 rows affected

      await expect(therapistService.deleteTherapist(99)).rejects.toThrow('Therapist profile not found.');
    });
  });
});
