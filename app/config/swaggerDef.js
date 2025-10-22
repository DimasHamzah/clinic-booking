const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Beauty Clinic API',
    version: '1.0.0',
    description: 'A clean, robust, and well-documented API for the Beauty Clinic application.',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: `/api/v1`,
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication, authorization, and password management.',
    },
    {
      name: 'Users',
      description: 'User management and retrieval (Protected).',
    },
    {
      name: 'Therapists',
      description: 'Therapist profile management (Admin Only).',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      // --- User Schemas ---
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          username: { type: 'string', example: 'johndoe' },
          email: { type: 'string', example: 'john.doe@example.com' },
          displayName: { type: 'string', example: 'John Doe' },
          role: { type: 'string', enum: ['CUSTOMER', 'STAFF', 'ADMIN'], example: 'CUSTOMER' },
          phoneNumber: { type: 'string', nullable: true, example: '081234567890' },
        },
      },
      CreateUser: {
        type: 'object',
        required: ['username', 'email', 'password', 'displayName'],
        properties: {
          username: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string', minLength: 8 },
          displayName: { type: 'string' },
          role: { type: 'string', enum: ['CUSTOMER', 'STAFF', 'ADMIN'] },
        },
      },
      UpdateUser: {
        type: 'object',
        properties: {
          displayName: { type: 'string' },
          role: { type: 'string', enum: ['CUSTOMER', 'STAFF', 'ADMIN'] },
        },
      },
      // --- Therapist Schemas ---
      TherapistProfile: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          userId: { type: 'integer', example: 2 },
          specialization: { type: 'string', example: 'Facial Treatment' },
          rating: { type: 'number', format: 'float', example: 4.8 },
          isActive: { type: 'boolean', example: true },
          user: { $ref: '#/components/schemas/User' },
        },
      },
      CreateTherapist: {
        type: 'object',
        required: ['userId', 'specialization'],
        properties: {
          userId: { type: 'integer', description: 'The ID of the user to be made a therapist.', example: 2 },
          specialization: { type: 'string', example: 'Aromatherapy' },
        },
      },
      UpdateTherapist: {
        type: 'object',
        properties: {
          specialization: { type: 'string', example: 'Deep Tissue Massage' },
          rating: { type: 'number', format: 'float', example: 4.9 },
          isActive: { type: 'boolean', example: false },
        },
      },
    },
  },
  paths: {
    // --- Authentication Paths ---
    '/auth/signin': {
      post: {
        tags: ['Authentication'],
        summary: 'User sign-in',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' } } } } } },
        responses: { '200': { description: 'Signed in successfully.' }, '400': { description: 'Bad Request (validation failed).' }, '401': { description: 'Invalid credentials.' } },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Request a password reset email',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } } } } },
        responses: { '200': { description: 'Password reset email sent.' }, '400': { description: 'Bad Request (validation failed).' } },
      },
    },
    '/auth/reset-password/{token}': {
      put: {
        tags: ['Authentication'],
        summary: 'Reset user password using a valid token',
        parameters: [{ in: 'path', name: 'token', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['newPassword'], properties: { newPassword: { type: 'string', format: 'password', minLength: 8 } } } } } },
        responses: { '200': { description: 'Password has been reset successfully.' }, '400': { description: 'Bad Request (invalid token or password too short).' } },
      },
    },

    // --- User Paths (Protected) ---
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Retrieve a list of users',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'query', name: 'page', schema: { type: 'integer', default: 1 } }, { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } }],
        responses: { '200': { description: 'A list of users.' }, '401': { description: 'Not authorized.' }, '403': { description: 'Forbidden.' } },
      },
      post: {
        tags: ['Users'],
        summary: 'Create a new user',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateUser' } } } },
        responses: { '201': { description: 'User created successfully.' }, '400': { description: 'Bad Request (validation failed).' }, '401': { description: 'Not authorized.' }, '403': { description: 'Forbidden.' }, '409': { description: 'Conflict (username or email already exists).' } },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get a user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'User data.' }, '401': { description: 'Not authorized.' }, '403': { description: 'Forbidden.' }, '404': { description: 'User not found.' } },
      },
      put: {
        tags: ['Users'],
        summary: 'Update a user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateUser' } } } },
        responses: { '200': { description: 'User updated successfully.' }, '401': { description: 'Not authorized.' }, '403': { description: 'Forbidden.' }, '404': { description: 'User not found.' } },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete a user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { '204': { description: 'User deleted successfully.' }, '401': { description: 'Not authorized.' }, '403': { description: 'Forbidden.' }, '404': { description: 'User not found.' } },
      },
    },

    // --- Therapist Paths (Admin Only) ---
    '/therapists': {
      get: {
        tags: ['Therapists'],
        summary: 'Retrieve a list of all therapist profiles',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          '200': { description: 'A list of therapist profiles.' },
          '401': { description: 'Not authorized.' },
          '403': { description: 'Forbidden. Admin access required.' },
        },
      },
      post: {
        tags: ['Therapists'],
        summary: 'Create a new therapist profile for a user',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTherapist' } } },
        },
        responses: {
          '201': { description: 'Therapist profile created successfully.' },
          '400': { description: 'Bad Request (validation failed).' },
          '401': { description: 'Not authorized.' },
          '403': { description: 'Forbidden. Admin access required.' },
          '404': { description: 'User to be made a therapist not found.' },
          '409': { description: 'Conflict (User is already a therapist).' },
        },
      },
    },
    '/therapists/{id}': {
      get: {
        tags: ['Therapists'],
        summary: 'Get a single therapist profile by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Therapist profile data.' },
          '401': { description: 'Not authorized.' },
          '403': { description: 'Forbidden. Admin access required.' },
          '404': { description: 'Therapist profile not found.' },
        },
      },
      put: {
        tags: ['Therapists'],
        summary: 'Update a therapist profile',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateTherapist' } } },
        },
        responses: {
          '200': { description: 'Therapist profile updated successfully.' },
          '400': { description: 'Bad Request (validation failed).' },
          '401': { description: 'Not authorized.' },
          '403': { description: 'Forbidden. Admin access required.' },
          '404': { description: 'Therapist profile not found.' },
        },
      },
      delete: {
        tags: ['Therapists'],
        summary: 'Delete a therapist profile',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '204': { description: 'Therapist profile deleted successfully.' },
          '401': { description: 'Not authorized.' },
          '403': { description: 'Forbidden. Admin access required.' },
          '404': { description: 'Therapist profile not found.' },
        },
      },
    },
  },
};

module.exports = swaggerDefinition;
