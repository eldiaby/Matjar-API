const asyncHandler = require('express-async-handler');
const CustomError = require('../errors');

/**
 * @desc    Middleware to check if the user has one of the required roles
 * @param   {...string} roles - Allowed roles (e.g., ['admin', 'manager'])
 * @returns Middleware function
 */
module.exports.authorizePermission = (...roles) => {
  return asyncHandler((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'You are not authorized to access this resource.'
      );
    }

    next();
  });
};
