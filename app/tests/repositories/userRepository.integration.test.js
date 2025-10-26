const UserRepository = require("../../repositories/userRepository");
const db = require("../../db/models");

process.env.NODE_ENV = "test";

describe("UserRepository - Integration Test", () => {
  let userRepository;

  beforeAll(async () => {
    userRepository = new UserRepository({ userModel: db.User });
    await db.sequelize.sync({ force: true });
  });

  afterEach(async () => {
    // Use cascade to handle foreign key constraints
    await db.User.destroy({ where: {}, cascade: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it("should create a user successfully", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      displayName: "Test User",
    };
    const createdUser = await userRepository.create(userData);
    expect(createdUser).toBeDefined();
    expect(createdUser.username).toBe("testuser");
  });

  // ... other tests remain the same
});
