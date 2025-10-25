const express = require('express');
const createUserRouter = require('./userRoutes');
const createAuthRouter = require('./authRoutes');
const createTherapistRouter = require('./therapistRoutes');
const createServiceRouter = require('./serviceRoutes');
const createScheduleRouter = require('./scheduleRoutes');

const createMainRouter = (container) => {
  const router = express.Router();

  // Pass the entire container to each sub-router factory
  router.use('/auth', createAuthRouter(container));
  router.use('/users', createUserRouter(container));
  router.use('/therapists', createTherapistRouter(container));
  router.use('/services', createServiceRouter(container));
  router.use('/schedules', createScheduleRouter(container));

  return router;
};

module.exports = createMainRouter;
