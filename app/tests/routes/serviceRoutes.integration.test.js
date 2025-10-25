require('dotenv').config(); // Load environment variables for tests
const request = require('supertest');

// Import factory functions and container to build the app for testing
const createApp = require('../../app');
const createMainRouter = require('../../routes');
const container = require('../../container');

// Destructure necessary components from the container
const { db, errorHandler, logger } = container;
const swaggerSpec = require('../../config/swaggerDef');

// Set the environment to 'test'
process.env.NODE_ENV = 'test';

// --- Build the app for testing ---
const mainRouter = createMainRouter(container);
const app = createApp({ mainRouter, errorHandler, logger, swaggerSpec });
// --- End app build ---

describe('Service API Integration Tests', () => {
  let adminToken;
  let serviceId;

  // Before all tests, sync the database and create an admin user
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    // Create an admin user for authentication
    await db.User.create({
      username: 'testadmin',
      email: 'admin@test.com',
      password: 'adminpassword',
      displayName: 'Test Admin',
      role: 'ADMIN',
    });

    // Manually sign in as admin to get a token for protected routes
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'admin@test.com', password: 'adminpassword' });

    adminToken = res.body.data.token;
  });

  // After all tests, close the database connection
  afterAll(async () => {
    await db.sequelize.close();
  });

  // --- Test for POST /api/v1/services ---
  describe('POST /api/v1/services', () => {
    it('should create a new service and return 201', async () => {
      const res = await request(app)
        .post('/api/v1/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Manicure', description: 'Nail care.', duration_minutes: 45, price: 120000 });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty('id');
      serviceId = res.body.data.id;
    });
  });
});
