const asyncHandler = require('./asyncHandler');

/**
 * Factory function to create authentication middleware.
 * @param {object} dependencies - The dependencies for the middleware.
 * @param {object} dependencies.userRepository - The user repository for database access.
 * @param {object} dependencies.jwt - The JSON Web Token library.
 * @param {object} dependencies.logger - The application logger.
 * @returns {{protect: function, authorize: function}} An object containing the protect and authorize middleware.
 */
const createAuthMiddleware = ({ userRepository, jwt, logger }) => {
  /**
   * Middleware to protect routes by verifying a JWT.
   */
  const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const error = new Error('Not authorized, no token provided.');
      error.statusCode = 401;
      return next(error);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to request object
      const user = await userRepository.findById(decoded.id);

      if (!user) {
        const error = new Error('Not authorized, user not found.');
        error.statusCode = 401;
        return next(error);
      }

      // Exclude password from the user object
      const { password, ...userWithoutPassword } = user.toJSON();
      req.user = userWithoutPassword;

      next();
    } catch (err) {
      logger.error(`Token verification failed: ${err.message}`);
      const error = new Error('Not authorized, token failed.');
      error.statusCode = 401;
      return next(error);
    }
  });

  /**
   * Middleware to authorize based on user roles.
   * @param  {...string} roles - The roles allowed to access the route.
   */
  const authorize = (...roles) => {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        const error = new Error(`User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this route.`);
        error.statusCode = 403; // Forbidden
        return next(error);
      }
      next();
    };
  };

  return {
    protect,
    authorize,
  };
};

module.exports = createAuthMiddleware;
