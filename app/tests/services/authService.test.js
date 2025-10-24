const AuthService = require('../../services/authService');
// eslint-disable-next-line no-unused-vars
const crypto = require('crypto');

// --- Mock Dependencies ---
const mockUserRepository = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  userModel: { sequelize: { Op: { gt: Symbol('gt') } } }, // Mocking the Op object
};

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

const mockSendEmail = jest.fn();

const mockJwt = {
  sign: jest.fn(),
};

// --- Instantiate the Service with Mocks ---
const authService = new AuthService({
  userRepository: mockUserRepository,
  logger: mockLogger,
  sendEmail: mockSendEmail,
  jwt: mockJwt,
});

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Test for signIn ---
  describe('signIn', () => {
    it('should sign in a user and return a token successfully', async () => {
      const user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        validatePassword: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ id: 1, username: 'testuser' }),
      };
      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockJwt.sign.mockReturnValue('mock_token');

      const result = await authService.signIn('test@example.com', 'password123');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(user.validatePassword).toHaveBeenCalledWith('password123');
      expect(mockJwt.sign).toHaveBeenCalledWith({ id: 1 }, process.env.JWT_SECRET, expect.any(Object));
      expect(result).toEqual({ token: 'mock_token', user: { id: 1, username: 'testuser' } });
    });

    it('should throw 401 error for non-existent user', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.signIn('wrong@example.com', 'password123')).rejects.toThrow('Invalid credentials.');
    });

    it('should throw 401 error for incorrect password', async () => {
      const user = {
        validatePassword: jest.fn().mockResolvedValue(false),
      };
      mockUserRepository.findByEmail.mockResolvedValue(user);

      await expect(authService.signIn('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials.');
    });
  });

  // --- Test for forgotPassword ---
  describe('forgotPassword', () => {
    it('should generate a reset token and send an email', async () => {
      const user = {
        email: 'test@example.com',
        getResetPasswordToken: jest.fn().mockReturnValue('unhashed_token'),
        save: jest.fn(),
      };
      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockSendEmail.mockResolvedValue();

      await authService.forgotPassword('test@example.com');

      expect(user.getResetPasswordToken).toHaveBeenCalled();
      expect(user.save).toHaveBeenCalled();
      expect(mockSendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: 'test@example.com' }));
    });

    it('should not throw an error for a non-existent email (security)', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.forgotPassword('nonexistent@example.com')).resolves.not.toThrow();
      expect(mockSendEmail).not.toHaveBeenCalled();
    });
  });

  // --- Test for resetPassword ---
  describe('resetPassword', () => {
    it('should reset the password successfully with a valid token', async () => {
      const user = {
        username: 'testuser',
        password: '', // Will be set by the service
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
        save: jest.fn(),
        toJSON: () => ({ username: 'testuser' }),
      };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await authService.resetPassword('valid_token', 'newpassword123');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ passwordResetToken: expect.any(String) })
      }));
      expect(user.password).toBe('newpassword123');
      expect(user.passwordResetToken).toBeUndefined();
      expect(user.passwordResetExpires).toBeUndefined();
      expect(user.save).toHaveBeenCalled();
      expect(result).toEqual({ username: 'testuser' });
    });

    it('should throw an error for an invalid or expired token', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(authService.resetPassword('invalid_token', 'newpassword123')).rejects.toThrow('Invalid or expired token.');
    });
  });
});
