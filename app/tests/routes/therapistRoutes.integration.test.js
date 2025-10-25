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

describe('Therapist API Integration Tests', () => {
  let adminToken;
  let regularUser;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    await db.User.create({
      username: 'testadmin',
      email: 'admin@test.com',
      password: 'adminpassword',
      displayName: 'Test Admin',
      role: 'ADMIN',
    });

    regularUser = await db.User.create({
      username: 'therapistuser',
      email: 'therapist@test.com',
      password: 'therapistpassword',
      displayName: 'Therapist User',
      role: 'CUSTOMER',
    });

    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'admin@test.com', password: 'adminpassword' });

    adminToken = res.body.data.token;
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it('should successfully create a therapist profile', async () => {
    const res = await request(app)
      .post('/api/v1/therapists')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ userId: regularUser.id, specialization: 'Facials' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.data.specialization).toBe('Facials');
  });
});
