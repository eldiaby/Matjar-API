// ==========================
// 📦 FUNCTION: createTokenUser
// ==========================
/**
 * @desc    Create a token-friendly user object containing essential details.
 * @param   {Object} user - The user object from the database
 * @returns {Object} - A simplified user object containing name, userId, and role
 */
module.exports.createTokenUser = ({ user }) => {
  // Create a simplified user object to include only the necessary details
  const tokenUser = {
    name: user.name, // User's name
    userId: user._id, // User's unique ID
    role: user.role, // User's role (admin, user, etc.)
  };

  // Return the simplified object that will be used in the JWT
  return tokenUser;
};
