const asyncHandler = require("./asyncHandler");

const createAuthMiddleware = ({ userRepository, jwt, logger }) => {
  const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      [, token] = req.headers.authorization.split(" ");
    }

    if (!token) {
      const error = new Error("Not authorized, no token provided.");
      error.statusCode = 401;
      return next(error);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userRepository.findById(decoded.id);

      if (!user) {
        const error = new Error("Not authorized, user not found.");
        error.statusCode = 401;
        return next(error);
      }

      // eslint-disable-next-line no-unused-vars
      const { password, ...userWithoutPassword } = user.toJSON();
      req.user = userWithoutPassword;

      return next();
    } catch (err) {
      logger.error(`Token verification failed: ${err.message}`);
      const error = new Error("Not authorized, token failed.");
      error.statusCode = 401;
      return next(error);
    }
  });

  const authorize =
    (...roles) =>
    (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        const error = new Error(
          `User role '${req.user ? req.user.role : "guest"}' is not authorized to access this route.`,
        );
        error.statusCode = 403;
        return next(error);
      }
      return next();
    };

  return {
    protect,
    authorize,
  };
};

module.exports = createAuthMiddleware;
