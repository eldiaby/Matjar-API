const asyncHandler = require(`express-async-handler`);
const User = require(`./../models/userModel.js`);
const { StatusCodes } = require(`http-status-codes`);
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require(`./../errors`);
const { attackCookiesToResponse } = require(`./../utils/JWT.js`);

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
  const { oldPassword, newPassword, newPasswordConfirm } = req.body;

  // 🛑 Check required fields
  if (!oldPassword || !newPassword || !newPasswordConfirm) {
    throw new BadRequestError(
      'All password fields (old, new, confirm) are required.'
    );
  }

  // 🔍 Get user from DB
  const user = await User.findById(req.user.userId);

  // 🔐 Compare old password with stored password
  const isPasswordsMatches = await user.compareUserPassword(oldPassword);
  if (!isPasswordsMatches) {
    throw new UnauthenticatedError(
      'The old password you entered is incorrect.'
    );
  }

  // ✏️ Set new password fields
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  // 💾 Save to trigger pre('save') for hashing
  await user.save();

  // 🎫 Create new token payload
  const tokenUser = {
    userId: user._id,
    name: user.name,
    role: user.role,
  };

  // 🍪 Send new token cookie
  attackCookiesToResponse({ res, tokenUser });

  // ✅ Send response
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Your password has been updated successfully.' });
});
