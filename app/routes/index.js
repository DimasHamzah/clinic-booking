const express = require('express');
const createUserRouter = require('./userRoutes');
const createAuthRouter = require('./authRoutes');
const createTherapistRouter = require('./therapistRoutes');
const createServiceRouter = require('./serviceRoutes');
const createScheduleRouter = require('./scheduleRoutes');

const createMainRouter = (container) => {
  const router = express.Router();

  const { 
    authController, 
    userController, 
    therapistController, 
    serviceController, 
    scheduleController, 
    ...rest 
  } = container;

  const authRouter = createAuthRouter({ authController, ...rest });
  const userRouter = createUserRouter({ userController, ...rest });
  const therapistRouter = createTherapistRouter({ therapistController, ...rest });
  const serviceRouter = createServiceRouter({ serviceController, ...rest });
  const scheduleRouter = createScheduleRouter({ scheduleController, ...rest });

  router.use('/auth', authRouter);
  router.use('/users', userRouter);
  router.use('/therapists', therapistRouter);
  router.use('/services', serviceRouter);
  router.use('/schedules', scheduleRouter);

  return router;
};

module.exports = createMainRouter;
