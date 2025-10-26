const TherapistRepository = require("../../repositories/therapistRepository");
const db = require("../../db/models");

process.env.NODE_ENV = "test";

describe("TherapistRepository - Integration Test", () => {
  let therapistRepository;
  let testUser;

  beforeAll(async () => {
    therapistRepository = new TherapistRepository({
      therapistModel: db.Therapist,
    });
    await db.sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    // Create a fresh user for each test to ensure isolation
    testUser = await db.User.create({
      username: "therapistuser",
      email: "therapist@example.com",
      password: "password123",
      displayName: "Therapist User",
    });
  });

  afterEach(async () => {
    // Clean up all tables with cascade to respect foreign key constraints
    await db.User.destroy({ where: {}, cascade: true });
    await db.Therapist.destroy({ where: {}, cascade: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it("should create a therapist profile successfully", async () => {
    const therapistData = {
      userId: testUser.id,
      specialization: "Massage Therapy",
    };
    const createdTherapist = await therapistRepository.create(therapistData);
    expect(createdTherapist).toBeDefined();
    expect(createdTherapist.userId).toBe(testUser.id);
  });

  // ... other tests
});
