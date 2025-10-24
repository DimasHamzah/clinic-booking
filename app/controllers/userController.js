const asyncHandler = require("../middleware/asyncHandler");

class UserController {
  constructor({ userService, sendSuccess }) {
    this.userService = userService;
    this.sendSuccess = sendSuccess;
  }

  createUser = asyncHandler(async (req, res) => {
    const user = await this.userService.createUser(req.body);
    this.sendSuccess(res, "User created successfully", user, 201);
  });

  getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { users, total } = await this.userService.getAllUsers({
      limit,
      offset,
    });

    const responseData = {
      users,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    };

    this.sendSuccess(res, "Users retrieved successfully", responseData);
  });

  getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await this.userService.getUserById(parseInt(id, 10));
    this.sendSuccess(res, "User retrieved successfully", user);
  });

  updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedUser = await this.userService.updateUser(
      parseInt(id, 10),
      req.body,
    );
    this.sendSuccess(res, "User updated successfully", updatedUser);
  });

  deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await this.userService.deleteUser(parseInt(id, 10));
    this.sendSuccess(res, "User deleted successfully", null, 204);
  });
}

module.exports = UserController;
