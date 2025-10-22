const express = require('express');
const {
  createTherapistValidator,
  updateTherapistValidator,
} = require('../middleware/validators');

/**
 * Factory function to create the therapist router.
 * @param {object} dependencies - The dependencies for the router.
 * @param {object} dependencies.therapistController - The therapist controller.
 * @param {function} dependencies.protect - The protect middleware for authentication.
 * @param {function} dependencies.authorize - The authorize middleware for role-based access control.
 * @returns {express.Router} The configured therapist router.
 */
const createTherapistRouter = ({ therapistController, protect, authorize }) => {
  const router = express.Router();

  // --- All routes below are protected and restricted to ADMINs ---
  router.use(protect);
  router.use(authorize('ADMIN'));

  // Route to get all therapists and create a new therapist profile
  router
    .route('/')
    .get(therapistController.getAllTherapists)
    .post(createTherapistValidator, therapistController.createTherapist);

  // Route to get, update, and delete a specific therapist profile by ID
  router
    .route('/:id')
    .get(therapistController.getTherapistById)
    .put(updateTherapistValidator, therapistController.updateTherapist)
    .delete(therapistController.deleteTherapist);

  return router;
};

module.exports = createTherapistRouter;
