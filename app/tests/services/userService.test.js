const UserService = require('../../services/userService');

const mockUserRepository = {
  findByUsername: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

const userService = new UserService({
  userRepository: mockUserRepository,
  logger: mockLogger,
});

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should throw an error if username already exists', async () => {
      const userData = { username: 'existinguser' };
      mockUserRepository.findByUsername.mockResolvedValue({ id: 1, username: 'existinguser' });

      await expect(userService.createUser(userData)).rejects.toThrow('Username already exists.');
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should throw an error if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(userService.getUserById(999)).rejects.toThrow('User not found.');
    });
  });
});
