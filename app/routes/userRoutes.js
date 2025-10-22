const express = require('express');
const { createUserValidator } = require('../middleware/validators');

/**
 * Factory function to create the user router.
 * @param {object} dependencies - The dependencies for the router.
 * @param {object} dependencies.userController - The user controller.
 * @param {function} dependencies.protect - The protect middleware.
 * @param {function} dependencies.authorize - The authorize middleware.
 * @returns {express.Router} The configured user router.
 */
const createUserRouter = ({ userController, protect, authorize }) => {
  const router = express.Router();

  // All routes below this are protected
  router.use(protect);

  router
    .route('/')
    .get(authorize('ADMIN', 'STAFF'), userController.getAllUsers)
    .post(authorize('ADMIN'), createUserValidator, userController.createUser);

  router
    .route('/:id')
    .get(authorize('ADMIN', 'STAFF'), userController.getUserById)
    .put(authorize('ADMIN'), userController.updateUser) // Note: Add an updateUserValidator here if needed
    .delete(authorize('ADMIN'), userController.deleteUser);

  return router;
};

module.exports = createUserRouter;
