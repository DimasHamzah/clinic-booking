const request = require('supertest');

// Import factory functions and container to build the app for testing
const createApp = require('../../../app/app');
const createMainRouter = require('../../../app/routes');
const container = require('../../../app/container');

// Destructure necessary components from the container
const { db, errorHandler, logger, swaggerSpec } = container;

// Set the environment to 'test'
process.env.NODE_ENV = 'test';

// --- Build the app for testing ---
const mainRouter = createMainRouter(container);
const app = createApp({ mainRouter, errorHandler, logger, swaggerSpec });
// --- End app build ---

describe('User API Integration Tests', () => {
  let adminToken;

  // Before all tests, sync the database and get an admin token
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    // Seed the database to ensure the admin user exists
    // (Assuming the seeder runs or we create a user manually)
    const adminUser = await db.User.create({
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

  let userId;

  // Test for POST /api/v1/users - Create User
  describe('POST /api/v1/users', () => {
    it('should create a new user and return 201 when authenticated as ADMIN', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: 'integrationtest',
          email: 'integration@test.com',
          password: 'password123',
          displayName: 'Integration Test User',
          role: 'CUSTOMER',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.username).toBe('integrationtest');

      // Save the user ID for later tests
      userId = res.body.data.id;
    });

    it('should return 401 if not authenticated', async () => {
        const res = await request(app)
          .post('/api/v1/users')
          .send({ username: 'failtest' });
        
        expect(res.statusCode).toEqual(401);
    });
  });

  // Test for GET /api/v1/users - Get All Users
  describe('GET /api/v1/users', () => {
    it('should return all users when authenticated as ADMIN', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.users).toBeInstanceOf(Array);
      expect(res.body.data.users.length).toBeGreaterThan(0);
    });
  });

  // Test for GET /api/v1/users/:id - Get User by ID
  describe('GET /api/v1/users/:id', () => {
    it('should return a single user when authenticated', async () => {
      const res = await request(app)
        .get(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.id).toBe(userId);
    });

    it('should return 404 if user not found', async () => {
      const res = await request(app)
        .get('/api/v1/users/9999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(404);
    });
  });

  // Test for DELETE /api/v1/users/:id - Delete User
  describe('DELETE /api/v1/users/:id', () => {
    it('should delete a user and return status 204 when authenticated as ADMIN', async () => {
      const res = await request(app)
        .delete(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(204);
    });
  });
});
