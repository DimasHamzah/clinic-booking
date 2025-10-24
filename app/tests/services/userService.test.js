const UserService = require("../../services/userService");

// Mock dependencies
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

// Instantiate the service with mock dependencies
const userService = new UserService({
  userRepository: mockUserRepository,
  logger: mockLogger,
});

describe("UserService", () => {
  beforeEach(() => {
    // Clear all mock function calls before each test
    jest.clearAllMocks();
  });

  // Test for createUser
  describe("createUser", () => {
    it("should create a new user successfully", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        displayName: "Test User",
        role: "CUSTOMER",
      };
      const createdUser = {
        ...userData,
        id: 1,
        toJSON: () => ({ ...userData, id: 1 }),
      };

      mockUserRepository.findByUsername.mockResolvedValue(null);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await userService.createUser(userData);

      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(
        userData.username,
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        userData.email,
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(
        expect.objectContaining({ id: 1, username: userData.username }),
      );
      expect(result).not.toHaveProperty("password");
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining("created successfully"),
      );
    });

    it("should throw an error if username already exists", async () => {
      const userData = { username: "existinguser" };
      mockUserRepository.findByUsername.mockResolvedValue({
        id: 1,
        username: "existinguser",
      });

      await expect(userService.createUser(userData)).rejects.toThrow(
        "Username already exists.",
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Username existinguser already exists."),
      );
    });
  });

  // Test for getUserById
  describe("getUserById", () => {
    it("should return a user by ID", async () => {
      const user = {
        id: 1,
        username: "testuser",
        toJSON: () => ({ id: 1, username: "testuser" }),
      };
      mockUserRepository.findById.mockResolvedValue(user);

      const result = await userService.getUserById(1);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, username: "testuser" });
    });

    it("should return null if user not found", async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      const result = await userService.getUserById(999);

      expect(result).toBeNull();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("User with ID 999 not found."),
      );
    });
  });

  // Test for deleteUser
  describe("deleteUser", () => {
    it("should delete a user successfully", async () => {
      mockUserRepository.delete.mockResolvedValue(1);

      const result = await userService.deleteUser(1);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it("should throw an error if user to delete is not found", async () => {
      mockUserRepository.delete.mockResolvedValue(0);

      await expect(userService.deleteUser(999)).rejects.toThrow(
        "User not found.",
      );
    });
  });
});
