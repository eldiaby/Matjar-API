const asyncHandler = require(`express-async-handler`);

const { isTokenValid } = require(`../utils/JWT.js`);

const CustomError = require(`../errors/index.js`);

module.exports.authenticateUser = asyncHandler(async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError(`Authentication Invalid`);
  }

  try {
    const { name, userId, role } = isTokenValid(token);
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError(`Authentication Invalid2`);
  }
});
