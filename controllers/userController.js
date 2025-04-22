const asyncHandler = require(`express-async-handler`);
const User = require(`./../models/userModel.js`);
const { StatusCodes } = require(`http-status-codes`);
const { NotFoundError } = require(`./../errors`);

module.exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({ role: 'user' })
    .select(`-password -__v`)
    .lean();

  res.status(StatusCodes.OK).json({ length: users.length, users });
});

module.exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id).select(`-password -__v`);

  if (!user) {
    throw new NotFoundError(`There is no user with this id: ${id}`);
  }

  res.status(StatusCodes.OK).json({ user });
});

module.exports.showCurrentUser = asyncHandler(async (req, res, next) => {
  res.status(StatusCodes.OK).json({ user: req.user });
});

module.exports.updateUser = asyncHandler(async (req, res, next) => {
  res.send(`<h1>Update A Single User</h1>`);
});

module.exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  res.send(`<h1>Update User Password</h1>`);
});
