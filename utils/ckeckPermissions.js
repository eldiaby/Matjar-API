// ==========================
// 📦 IMPORTS
// ==========================
const CustomError = require('../errors');

// ==========================
// 🛠️ FUNCTION: checkPermissions
// ==========================
/**
 * @desc    Check if the user has permission to access the resource
 * @param   {Object} requestUser - The user making the request
 * @param   {String} resourceUserId - The ID of the resource owner
 * @throws  {UnauthorizedError} If the user does not have permission
 * @returns {undefined} If the user is authorized
 */
module.exports.checkPermissions = (requestUser, resourceUserId) => {
  // If the user is an admin, allow access
  if (requestUser.role === 'admin') return;

  // If the user is the owner of the resource, allow access
  if (requestUser.userId === resourceUserId.toString()) return;

  // If neither condition is met, throw an Unauthorized error
  throw new CustomError.UnauthorizedError(
    'Not authorized to access this route'
  );
};
