const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Beauty Clinic API",
    version: "1.0.0",
    description:
      "A clean, robust, and well-documented API for the Beauty Clinic application.",
  },
  servers: [
    {
      url: "/api/v1",
      description: "Development server",
    },
  ],
  tags: [
    {
      name: "Authentication",
      description: "User authentication and password management.",
    },
    { name: "Users", description: "User management (Protected)." },
    {
      name: "Therapists",
      description: "Therapist profile management (Admin Only).",
    },
    {
      name: "Services",
      description: "Clinic service management (Admin Only).",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      // User Schemas
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          username: { type: "string", example: "johndoe" },
          email: { type: "string", example: "john.doe@example.com" },
          displayName: { type: "string", example: "John Doe" },
          role: { type: "string", enum: ["CUSTOMER", "STAFF", "ADMIN"] },
        },
      },
      CreateUser: {
        type: "object",
        required: ["username", "email", "password", "displayName"],
        properties: {
          username: { type: "string" },
          email: { type: "string" },
          password: { type: "string", minLength: 8 },
          displayName: { type: "string" },
          role: { type: "string", enum: ["CUSTOMER", "STAFF", "ADMIN"] },
        },
      },
      UpdateUser: {
        type: "object",
        properties: {
          displayName: { type: "string" },
          role: { type: "string", enum: ["CUSTOMER", "STAFF", "ADMIN"] },
        },
      },
      // Therapist Schemas
      TherapistProfile: {
        type: "object",
        properties: {
          id: { type: "integer" },
          userId: { type: "integer" },
          specialization: { type: "string" },
          rating: { type: "number", format: "float" },
          isActive: { type: "boolean" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      CreateTherapist: {
        type: "object",
        required: ["userId", "specialization"],
        properties: {
          userId: { type: "integer" },
          specialization: { type: "string" },
        },
      },
      UpdateTherapist: {
        type: "object",
        properties: {
          specialization: { type: "string" },
          rating: { type: "number", format: "float" },
          isActive: { type: "boolean" },
        },
      },
      // Service Schemas
      Service: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          duration_minutes: { type: "integer" },
          price: { type: "number", format: "float" },
          isActive: { type: "boolean" },
        },
      },
      CreateService: {
        type: "object",
        required: ["name", "description", "duration_minutes", "price"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          duration_minutes: { type: "integer" },
          price: { type: "number", format: "float" },
        },
      },
      UpdateService: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          duration_minutes: { type: "integer" },
          price: { type: "number", format: "float" },
          isActive: { type: "boolean" },
        },
      },
    },
  },
  paths: {
    // --- Authentication Paths ---
    "/auth/signin": {
      post: {
        tags: ["Authentication"],
        summary: "User sign-in",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Signed in successfully." },
          400: { description: "Bad Request (validation failed)." },
          401: { description: "Invalid credentials." },
        },
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Authentication"],
        summary: "Request a password reset email",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: { email: { type: "string", format: "email" } },
              },
            },
          },
        },
        responses: {
          200: { description: "Password reset email sent." },
          400: { description: "Bad Request (validation failed)." },
        },
      },
    },
    "/auth/reset-password/{token}": {
      put: {
        tags: ["Authentication"],
        summary: "Reset user password using a valid token",
        parameters: [
          {
            in: "path",
            name: "token",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["newPassword"],
                properties: {
                  newPassword: {
                    type: "string",
                    format: "password",
                    minLength: 8,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Password has been reset successfully." },
          400: {
            description: "Bad Request (invalid token or password too short).",
          },
        },
      },
    },
    // --- User Paths ---
    "/users": {
      get: {
        tags: ["Users"],
        summary: "Retrieve a list of users",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "A list of users." } },
      },
      post: {
        tags: ["Users"],
        summary: "Create a new user",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUser" },
            },
          },
        },
        responses: { 201: { description: "User created successfully." } },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get a user by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 200: { description: "User data." } },
      },
      put: {
        tags: ["Users"],
        summary: "Update a user by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUser" },
            },
          },
        },
        responses: { 200: { description: "User updated successfully." } },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete a user by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 204: { description: "User deleted successfully." } },
      },
    },
    // --- Therapist Paths ---
    "/therapists": {
      get: {
        tags: ["Therapists"],
        summary: "Retrieve a list of all therapist profiles",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "A list of therapist profiles." } },
      },
      post: {
        tags: ["Therapists"],
        summary: "Create a new therapist profile for a user",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTherapist" },
            },
          },
        },
        responses: {
          201: { description: "Therapist profile created successfully." },
        },
      },
    },
    "/therapists/{id}": {
      get: {
        tags: ["Therapists"],
        summary: "Get a single therapist profile by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 200: { description: "Therapist profile data." } },
      },
      put: {
        tags: ["Therapists"],
        summary: "Update a therapist profile",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTherapist" },
            },
          },
        },
        responses: {
          200: { description: "Therapist profile updated successfully." },
        },
      },
      delete: {
        tags: ["Therapists"],
        summary: "Delete a therapist profile",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          204: { description: "Therapist profile deleted successfully." },
        },
      },
    },
    // --- Service Paths ---
    "/services": {
      get: {
        tags: ["Services"],
        summary: "Retrieve a list of all services",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "A list of services." } },
      },
      post: {
        tags: ["Services"],
        summary: "Create a new service",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateService" },
            },
          },
        },
        responses: { 201: { description: "Service created successfully." } },
      },
    },
    "/services/{id}": {
      get: {
        tags: ["Services"],
        summary: "Get a single service by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 200: { description: "Service data." } },
      },
      put: {
        tags: ["Services"],
        summary: "Update a service",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateService" },
            },
          },
        },
        responses: { 200: { description: "Service updated successfully." } },
      },
      delete: {
        tags: ["Services"],
        summary: "Delete a service",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 204: { description: "Service deleted successfully." } },
      },
    },
  },
};

module.exports = swaggerDefinition;
