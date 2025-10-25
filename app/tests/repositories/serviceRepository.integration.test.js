const ServiceRepository = require('../../repositories/serviceRepository');
const db = require('../../db/models');

// Set the environment to 'test'
process.env.NODE_ENV = 'test';

describe('ServiceRepository - Integration Test', () => {
  let serviceRepository;

  beforeAll(async () => {
    serviceRepository = new ServiceRepository({ serviceModel: db.Service });
    await db.sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await db.Service.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it('should create a service successfully', async () => {
    const serviceData = {
      name: 'Deep Tissue Massage',
      description: 'An intense massage for muscle relief.',
      duration_minutes: 60,
      price: 300000,
    };

    const createdService = await serviceRepository.create(serviceData);

    expect(createdService).toBeDefined();
    expect(createdService.name).toBe('Deep Tissue Massage');
    expect(parseFloat(createdService.price)).toBe(300000);
  });

  it('should find a service by ID', async () => {
    const service = await db.Service.create({
      name: 'Hot Stone Massage',
      description: 'A relaxing massage with hot stones.',
      duration_minutes: 90,
      price: 450000,
    });

    const foundService = await serviceRepository.findById(service.id);

    expect(foundService).toBeDefined();
    expect(foundService.id).toBe(service.id);
    expect(foundService.name).toBe('Hot Stone Massage');
  });

  it('should update a service successfully', async () => {
    const service = await db.Service.create({
      name: 'Old Facial',
      description: 'An old facial treatment.',
      duration_minutes: 45,
      price: 150000,
    });

    const updatedService = await serviceRepository.update(service.id, { name: 'New Advanced Facial', price: 200000 });

    expect(updatedService).toBeDefined();
    expect(updatedService.name).toBe('New Advanced Facial');
    expect(parseFloat(updatedService.price)).toBe(200000);
  });

  it('should delete a service successfully', async () => {
    const service = await db.Service.create({
      name: 'To Be Deleted',
      description: 'This service will be deleted.',
      duration_minutes: 10,
      price: 50000,
    });

    const deletedRows = await serviceRepository.delete(service.id);
    expect(deletedRows).toBe(1);

    const foundService = await serviceRepository.findById(service.id);
    expect(foundService).toBeNull();
  });
});
