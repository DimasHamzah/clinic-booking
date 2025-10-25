const TherapistRepository = require('../../repositories/therapistRepository');
const db = require('../../db/models');

// Set the environment to 'test'
process.env.NODE_ENV = 'test';

describe('TherapistRepository - Integration Test', () => {
  let therapistRepository;
  let testUser;

  beforeAll(async () => {
    therapistRepository = new TherapistRepository({ therapistModel: db.Therapist });
    await db.sequelize.sync({ force: true });

    // Create a user to associate with the therapist profile
    testUser = await db.User.create({
      username: 'testtherapistuser',
      email: 'therapist@example.com',
      password: 'password123',
      displayName: 'Therapist User',
    });
  });

  afterEach(async () => {
    // Clean up the tables after each test
    await db.Therapist.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it('should create a therapist profile successfully', async () => {
    const therapistData = {
      userId: testUser.id,
      specialization: 'Massage Therapy',
      isActive: true,
    };

    const createdTherapist = await therapistRepository.create(therapistData);

    expect(createdTherapist).toBeDefined();
    expect(createdTherapist.userId).toBe(testUser.id);
    expect(createdTherapist.specialization).toBe('Massage Therapy');
  });

  it('should find a therapist profile by ID', async () => {
    const therapist = await db.Therapist.create({
      userId: testUser.id,
      specialization: 'Facials',
    });

    const foundTherapist = await therapistRepository.findById(therapist.id);

    expect(foundTherapist).toBeDefined();
    expect(foundTherapist.id).toBe(therapist.id);
    expect(foundTherapist.specialization).toBe('Facials');
  });

  it('should find a therapist profile by User ID', async () => {
    await db.Therapist.create({
      userId: testUser.id,
      specialization: 'Acupuncture',
    });

    const foundTherapist = await therapistRepository.findByUserId(testUser.id);

    expect(foundTherapist).toBeDefined();
    expect(foundTherapist.userId).toBe(testUser.id);
  });

  it('should update a therapist profile successfully', async () => {
    const therapist = await db.Therapist.create({
      userId: testUser.id,
      specialization: 'Old Specialization',
    });

    const updatedTherapist = await therapistRepository.update(therapist.id, { specialization: 'New Specialization' });

    expect(updatedTherapist).toBeDefined();
    expect(updatedTherapist.specialization).toBe('New Specialization');
  });

  it('should delete a therapist profile successfully', async () => {
    const therapist = await db.Therapist.create({
      userId: testUser.id,
      specialization: 'To Be Deleted',
    });

    const deletedRows = await therapistRepository.delete(therapist.id);
    expect(deletedRows).toBe(1);

    const foundTherapist = await therapistRepository.findById(therapist.id);
    expect(foundTherapist).toBeNull();
  });
});
