const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Beauty Clinic API',
    version: '1.0.0',
    description: 'A clean, robust, and well-documented API for the Beauty Clinic application.',
  },
  servers: [
    {
      url: `/api/v1`,
      description: 'Development server',
    },
  ],
  tags: [
    { name: 'Authentication', description: 'User authentication and password management.' },
    { name: 'Users', description: 'User management (Protected).' },
    { name: 'Therapists', description: 'Therapist profile management (Admin Only).' },
    { name: 'Services', description: 'Clinic service management (Admin Only).' },
    { name: 'Schedules', description: 'Therapist schedule management (Admin Only).' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      // User Schemas
      User: { /* ... */ },
      CreateUser: { /* ... */ },
      UpdateUser: { /* ... */ },
      // Therapist Schemas
      TherapistProfile: { /* ... */ },
      CreateTherapist: { /* ... */ },
      UpdateTherapist: { /* ... */ },
      // Service Schemas
      Service: { /* ... */ },
      CreateService: { /* ... */ },
      UpdateService: { /* ... */ },
      // Schedule Schemas
      Schedule: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          therapistId: { type: 'integer' },
          availableDate: { type: 'string', format: 'date' },
          startTime: { type: 'string', format: 'time' },
          endTime: { type: 'string', format: 'time' },
          isAvailable: { type: 'boolean' },
        },
      },
      CreateSchedule: {
        type: 'object',
        required: ['therapistId', 'availableDate', 'startTime', 'endTime'],
        properties: {
          therapistId: { type: 'integer' },
          availableDate: { type: 'string', format: 'date', example: '2024-12-31' },
          startTime: { type: 'string', format: 'time', example: '09:00' },
          endTime: { type: 'string', format: 'time', example: '17:00' },
        },
      },
    },
  },
  paths: {
    // Auth, User, Therapist, Service Paths
    /* ... */
    // Schedule Paths
    '/schedules': {
      get: { tags: ['Schedules'], summary: 'Get all schedules', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Success' } } },
      post: { tags: ['Schedules'], summary: 'Create a new schedule', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateSchedule' } } } }, responses: { '201': { description: 'Created' } } },
    },
    '/schedules/{id}': {
      get: { tags: ['Schedules'], summary: 'Get a schedule by ID', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Success' } } },
      put: { tags: ['Schedules'], summary: 'Update a schedule', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateSchedule' } } } }, responses: { '200': { description: 'Success' } } },
      delete: { tags: ['Schedules'], summary: 'Delete a schedule', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { '204': { description: 'No Content' } } },
    },
  },
};

module.exports = swaggerDefinition;
