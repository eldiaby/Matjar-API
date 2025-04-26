const CustomError = require(`./../errors`);

module.exports.checkPermissions = (requestUser, resourcUserId) => {
  if (requestUser.role === `admin`) return;
  if (requestUser.userId === resourcUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    `Not authorized to access this route`
  );
};
