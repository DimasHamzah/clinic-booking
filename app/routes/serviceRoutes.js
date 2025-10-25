const express = require('express');
const { serviceValidators } = require('../middleware/validators');

const createServiceRouter = ({ serviceController, protect, authorize }) => {
  const router = express.Router();

  router.use(protect);
  router.use(authorize('ADMIN'));

  router
    .route('/')
    .get(serviceController.getAllServices)
    .post(serviceValidators.create, serviceController.createService);

  router
    .route('/:id')
    .get(serviceController.getServiceById)
    .put(serviceValidators.update, serviceController.updateService)
    .delete(serviceController.deleteService);

  return router;
};

module.exports = createServiceRouter;
