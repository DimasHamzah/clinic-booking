// Load environment variables first
require("dotenv").config();

// Import factory functions
const createApp = require("./app");
const createMainRouter = require("./routes");

// Import other necessary components for app creation
const errorHandler = require("./middleware/errorHandler");
const swaggerSpec = require("./config/swagger");

// Import the DI container which holds all instantiated components
const container = require("./container");

const { logger, db } = container;

// --- Composition Root ---
// All dependencies are instantiated and wired together here.

// 1. Create the main router by injecting its dependencies from the container
const mainRouter = createMainRouter(container);

// 2. Create the Express app by injecting its dependencies
const app = createApp({ mainRouter, errorHandler, logger, swaggerSpec });

// 3. Start the server
const PORT = process.env.PORT || 3000;

// Sync Sequelize models with the database and then start the server
db.sequelize
  .sync()
  .then(() => {
    logger.info("Database synced successfully.");
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    logger.error("Failed to sync database:", err.message);
    process.exit(1);
  });
