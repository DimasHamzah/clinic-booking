const request = require("supertest");

// Import factory functions and container to build the app for testing
const createApp = require("../../app");
const createMainRouter = require("../../routes");
const container = require("../../container");

// Destructure necessary components from the container
const { db, errorHandler, logger } = container;
const swaggerSpec = require("../../config/swaggerDef");

// Set the environment to 'test'
process.env.NODE_ENV = "test";

// --- Build the app for testing ---
const mainRouter = createMainRouter(container);
const app = createApp({ mainRouter, errorHandler, logger, swaggerSpec });
// --- End app build ---

describe("Service API Integration Tests", () => {
  let adminToken;
  let serviceId;

  // Before all tests, sync the database and create an admin user
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    // Create an admin user for authentication
    await db.User.create({
      username: "testadmin",
      email: "admin@test.com",
      password: "adminpassword",
      displayName: "Test Admin",
      role: "ADMIN",
    });

    // Manually sign in as admin to get a token for protected routes
    const res = await request(app)
      .post("/api/v1/auth/signin")
      .send({ email: "admin@test.com", password: "adminpassword" });

    adminToken = res.body.data.token;
  });

  // After all tests, close the database connection
  afterAll(async () => {
    await db.sequelize.close();
  });

  // --- Test for POST /api/v1/services ---
  describe("POST /api/v1/services", () => {
    it("should return 401 Unauthorized if no token is provided", async () => {
      const res = await request(app).post("/api/v1/services").send({
        name: "Test Service",
        description: "A service.",
        duration_minutes: 30,
        price: 100000,
      });

      expect(res.statusCode).toEqual(401);
    });

    it("should return 400 Bad Request for missing name", async () => {
      const res = await request(app)
        .post("/api/v1/services")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          description: "A service.",
          duration_minutes: 30,
          price: 100000,
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain("Service name is required");
    });

    it("should create a new service and return 201", async () => {
      const res = await request(app)
        .post("/api/v1/services")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Manicure",
          description: "Nail care.",
          duration_minutes: 45,
          price: 120000,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.name).toBe("Manicure");

      serviceId = res.body.data.id; // Save for later tests
    });
  });

  // --- Test for GET /api/v1/services ---
  describe("GET /api/v1/services", () => {
    it("should return a list of services", async () => {
      const res = await request(app)
        .get("/api/v1/services")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.services).toBeInstanceOf(Array);
      expect(res.body.data.services.length).toBe(1);
    });
  });

  // --- Test for PUT /api/v1/services/:id ---
  describe("PUT /api/v1/services/:id", () => {
    it("should update a service and return 200", async () => {
      const res = await request(app)
        .put(`/api/v1/services/${serviceId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ price: 125000, description: "Premium nail care." });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.price).toBe("125000.00");
      expect(res.body.data.description).toBe("Premium nail care.");
    });

    it("should return 404 for a non-existent service ID", async () => {
      const res = await request(app)
        .put("/api/v1/services/999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ price: 100 });

      expect(res.statusCode).toEqual(404);
    });
  });

  // --- Test for DELETE /api/v1/services/:id ---
  describe("DELETE /api/v1/services/:id", () => {
    it("should delete a service and return 204", async () => {
      const res = await request(app)
        .delete(`/api/v1/services/${serviceId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(204);
    });

    it("should return 404 when trying to get the deleted service", async () => {
      const res = await request(app)
        .get(`/api/v1/services/${serviceId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(404);
    });
  });
});
