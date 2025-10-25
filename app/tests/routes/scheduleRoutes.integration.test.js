require('dotenv').config();
const request = require('supertest');
const createApp = require('../../app');
const createMainRouter = require('../../routes');
const container = require('../../container');

const { db, errorHandler, logger } = container;
const swaggerSpec = require('../../config/swaggerDef');

process.env.NODE_ENV = 'test';

const mainRouter = createMainRouter(container);
const app = createApp({ mainRouter, errorHandler, logger, swaggerSpec });

describe('Schedule API Integration Tests', () => {
  let adminToken;
  let therapistId;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    const admin = await db.User.create({ username: 'admin', email: 'admin@test.com', password: 'password', role: 'ADMIN' });
    const therapistUser = await db.User.create({ username: 'therapist', email: 'therapist@test.com', password: 'password' });
    const therapist = await db.Therapist.create({ userId: therapistUser.id, specialization: 'Massage' });
    therapistId = therapist.id;

    const res = await request(app).post('/api/v1/auth/signin').send({ email: 'admin@test.com', password: 'password' });
    adminToken = res.body.data.token;
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it('should create a schedule for a therapist', async () => {
    const res = await request(app)
      .post('/api/v1/schedules')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ therapistId, availableDate: '2025-01-01', startTime: '10:00', endTime: '12:00' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.data.therapistId).toBe(therapistId);
  });
});
