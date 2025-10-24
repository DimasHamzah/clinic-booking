const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");

// Load environment variables
dotenv.config();

/**
 * Factory function to create and configure the Express application.
 * @param {object} dependencies - The dependencies for the app.
 * @param {express.Router} dependencies.mainRouter - The main application router.
 * @param {function} dependencies.errorHandler - The custom error handling middleware.
 * @param {object} dependencies.logger - The application logger.
 * @param {object} dependencies.swaggerSpec - The OpenAPI specification object.
 * @returns {express.Application} The configured Express app instance.
 */
const createApp = ({ mainRouter, errorHandler, logger, swaggerSpec }) => {
  const app = express();

  // --- Middleware ---

  // Security middleware
  app.use(helmet());

  // Enable CORS
  app.use(cors());

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // HTTP request logger middleware (using morgan and our custom logger)
  app.use(morgan("combined", { stream: logger.stream }));

  // --- API Documentation Route ---
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // --- API Routes ---

  // Mount the main router
  app.use("/api/v1", mainRouter);

  // --- Health Check Route ---
  app.get("/", (req, res) => {
    res.status(200).json({
      status: "UP",
      message: "Beauty Clinic API is running.",
    });
  });

  // --- Error Handling ---

  // Handle 404 errors for routes not found
  app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.statusCode = 404;
    next(error);
  });

  // Use the custom error handler middleware
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
