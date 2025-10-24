const express = require("express");
const { authValidators } = require("../middleware/validators");

const createAuthRouter = ({ authController, protect }) => {
  const router = express.Router();

  router.post("/signin", authValidators.signIn, authController.signIn);

  router.post(
    "/forgot-password",
    authValidators.forgotPassword,
    authController.forgotPassword,
  );

  router.get("/verify-reset-token/:token", authController.verifyResetToken);

  router.put(
    "/reset-password/:token",
    authValidators.resetPassword,
    authController.resetPassword,
  );

  // This route doesn't have a validator in the new structure, which is fine.
  router.put("/change-email", protect, authController.changeEmail);

  return router;
};

module.exports = createAuthRouter;
