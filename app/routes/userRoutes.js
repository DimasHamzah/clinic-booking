const express = require("express");
const { userValidators } = require("../middleware/validators");

const createUserRouter = ({ userController, protect, authorize }) => {
  const router = express.Router();

  router.use(protect);

  router
    .route("/")
    .get(authorize("ADMIN", "STAFF"), userController.getAllUsers)
    .post(authorize("ADMIN"), userValidators.create, userController.createUser);

  router
    .route("/:id")
    .get(authorize("ADMIN", "STAFF"), userController.getUserById)
    .put(authorize("ADMIN"), userController.updateUser)
    .delete(authorize("ADMIN"), userController.deleteUser);

  return router;
};

module.exports = createUserRouter;
