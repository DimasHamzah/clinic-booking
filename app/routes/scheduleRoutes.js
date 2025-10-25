const express = require('express');
const { scheduleValidators } = require('../middleware/validators');

const createScheduleRouter = (container) => {
  const { scheduleController, protect, authorize } = container;

  const router = express.Router();

  router.use(protect);
  router.use(authorize('ADMIN'));

  router
    .route('/')
    .get(scheduleController.getAllSchedules)
    .post(scheduleValidators.create, scheduleController.createSchedule);

  router
    .route('/:id')
    .get(scheduleController.getScheduleById)
    .put(scheduleValidators.update, scheduleController.updateSchedule)
    .delete(scheduleController.deleteSchedule);

  return router;
};

module.exports = createScheduleRouter;
