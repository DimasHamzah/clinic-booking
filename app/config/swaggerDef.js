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
      // --- Schemas from previous setup ---
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          username: { type: 'string', example: 'johndoe' },
          email: { type: 'string', example: 'john.doe@example.com' },
          displayName: { type: 'string', example: 'John Doe' },
          role: { type: 'string', enum: ['CUSTOMER', 'STAFF', 'ADMIN'], example: 'CUSTOMER' },
          phoneNumber: { type: 'string', nullable: true, example: '081234567890' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateUser: {
        type: 'object',
        required: ['username', 'email', 'password', 'displayName'],
        properties: {
          username: { type: 'string', example: 'newuser' },
          email: { type: 'string', example: 'new.user@example.com' },
          password: { type: 'string', example: 'password123', description: 'Must be at least 8 characters long.' },
          displayName: { type: 'string', example: 'New User' },
          role: { type: 'string', enum: ['CUSTOMER', 'STAFF', 'ADMIN'], default: 'CUSTOMER' },
        },
      },
      UpdateUser: {
        type: 'object',
        properties: {
          displayName: { type: 'string', example: 'Updated User Name' },
          role: { type: 'string', enum: ['CUSTOMER', 'STAFF', 'ADMIN'] },
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
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'admin@example.com' },
                  password: { type: 'string', format: 'password', example: 'adminpassword' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Signed in successfully.' },
          '400': { description: 'Bad Request (validation failed).' },
          '401': { description: 'Invalid credentials.' },
        },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Request a password reset email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'customer@example.com' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Password reset email sent.' },
          '400': { description: 'Bad Request (validation failed).' },
        },
      },
    },
    '/auth/reset-password/{token}': {
      put: {
        tags: ['Authentication'],
        summary: 'Reset user password using a valid token',
        parameters: [
          { in: 'path', name: 'token', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['newPassword'],
                properties: {
                  newPassword: { type: 'string', format: 'password', example: 'newSecurePassword123', minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Password has been reset successfully.' },
          '400': { description: 'Bad Request (invalid token or password too short).' },
        },
      },
    },
    // --- User Paths (Protected) ---
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Retrieve a list of users',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 }, description: 'Page number.' },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 }, description: 'Items per page.' },
        ],
        responses: {
          '200': { description: 'A list of users.' },
          '401': { description: 'Not authorized.' },
          '403': { description: 'Forbidden.' },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create a new user',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateUser' } } },
        },
        responses: {
          '201': { description: 'User created successfully.' },
          '400': { description: 'Bad Request (validation failed).' },
          '401': { description: 'Not authorized.' },
          '403': { description: 'Forbidden.' },
          '409': { description: 'Conflict (username or email already exists).' },
        },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get a user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' }, description: 'The user ID.' },
        ],
        responses: {
          '200': { description: 'User data.' },
          '401': { description: 'Not authorized.' },
          '403': { description: 'Forbidden.' },
          '404': { description: 'User not found.' },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update a user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' }, description: 'The user ID.' },
        ],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateUser' } } },
        },
        responses: {
          '200': { description: 'User updated successfully.' },
          '401': { description: 'Not authorized.' },
          '403': { description: 'Forbidden.' },
          '404': { description: 'User not found.' },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete a user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' }, description: 'The user ID.' },
        ],
        responses: {
          '204': { description: 'User deleted successfully.' },
          '401': { description: 'Not authorized.' },
          '403': { description: 'Forbidden.' },
          '404': { description: 'User not found.' },
        },
      },
    },
  },
};

module.exports = swaggerDefinition;
