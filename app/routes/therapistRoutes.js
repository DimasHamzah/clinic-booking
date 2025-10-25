const express = require('express');
const { therapistValidators } = require('../middleware/validators');

const createTherapistRouter = ({ therapistController, protect, authorize }) => {
  const router = express.Router();

  router.use(protect);
  router.use(authorize('ADMIN'));

  router
    .route('/')
    .get(therapistController.getAllTherapists)
    .post(therapistValidators.create, therapistController.createTherapist);

  router
    .route('/:id')
    .get(therapistController.getTherapistById)
    .put(therapistValidators.update, therapistController.updateTherapist)
    .delete(therapistController.deleteTherapist);

  return router;
};

module.exports = createTherapistRouter;
