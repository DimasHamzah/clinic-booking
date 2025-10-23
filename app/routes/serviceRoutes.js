const express = require('express');
const {
  createServiceValidator,
  updateServiceValidator,
} = require('../middleware/validators');

/**
 * Factory function to create the service router.
 * @param {object} dependencies - The dependencies for the router.
 * @param {object} dependencies.serviceController - The service controller.
 * @param {function} dependencies.protect - The protect middleware for authentication.
 * @param {function} dependencies.authorize - The authorize middleware for role-based access control.
 * @returns {express.Router} The configured service router.
 */
const createServiceRouter = ({ serviceController, protect, authorize }) => {
  const router = express.Router();

  // --- All routes below are protected and restricted to ADMINs ---
  router.use(protect);
  router.use(authorize('ADMIN'));

  // Route to get all services and create a new service
  router
    .route('/')
    .get(serviceController.getAllServices)
    .post(createServiceValidator, serviceController.createService);

  // Route to get, update, and delete a specific service by ID
  router
    .route('/:id')
    .get(serviceController.getServiceById)
    .put(updateServiceValidator, serviceController.updateService)
    .delete(serviceController.deleteService);

  return router;
};

module.exports = createServiceRouter;
