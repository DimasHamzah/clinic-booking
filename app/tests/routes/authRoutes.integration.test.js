const request = require("supertest");

// Import factory functions and container to build the app for testing
const createApp = require("../../app");
const createMainRouter = require("../../routes");
const container = require("../../container");

// Destructure necessary components from the container
const { db, errorHandler, logger } = container;

// Use the real swagger definition for testing
const swaggerSpec = require("../../config/swaggerDef");

// Set the environment to 'test'
process.env.NODE_ENV = "test";

// --- Build the app for testing ---
const mainRouter = createMainRouter(container);
const app = createApp({ mainRouter, errorHandler, logger, swaggerSpec });
// --- End app build ---

describe("Auth API Integration Tests", () => {
  // Before all tests, sync the database and create a test user
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    await db.User.create({
      username: "testuser",
      email: "test@example.com",
      password: "password123", // Will be hashed by the model hook
      displayName: "Test User",
      role: "CUSTOMER",
    });
  });

  // After all tests, close the database connection
  afterAll(async () => {
    await db.sequelize.close();
  });

  // --- Test for POST /api/v1/auth/signin ---
  describe("POST /api/v1/auth/signin", () => {
    it("should sign in successfully with correct credentials", async () => {
      const res = await request(app)
        .post("/api/v1/auth/signin")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("token");
      expect(res.body.data.user.email).toBe("test@example.com");
    });

    it("should fail with 401 for incorrect password", async () => {
      const res = await request(app)
        .post("/api/v1/auth/signin")
        .send({ email: "test@example.com", password: "wrongpassword" });

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid credentials.");
    });

    it("should fail with 400 for invalid email format (validation)", async () => {
      const res = await request(app)
        .post("/api/v1/auth/signin")
        .send({ email: "not-an-email", password: "password123" });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain(
        "Please provide a valid email address.",
      );
    });
  });

  // --- Test for POST /api/v1/auth/forgot-password ---
  describe("POST /api/v1/auth/forgot-password", () => {
    it("should always return 200 for security reasons, even if email does not exist", async () => {
      const res = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "nonexistent@example.com" });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe(
        "Password reset email sent. Check your inbox.",
      );
    });

    it("should return 200 for an existing email and trigger the process", async () => {
      const res = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "test@example.com" });

      expect(res.statusCode).toEqual(200);

      // Verify in the database that a reset token was set
      const user = await db.User.findOne({
        where: { email: "test@example.com" },
      });
      expect(user.passwordResetToken).not.toBeNull();
      expect(user.passwordResetExpires).not.toBeNull();
    });
  });
});
