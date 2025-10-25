const express = require('express');
const { scheduleValidators } = require('../middleware/validators');

const createScheduleRouter = ({ scheduleController, protect, authorize }) => {
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
