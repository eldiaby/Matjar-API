// ==========================
// IMPORTS & DEPENDENCIES
// ==========================

// Packages
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');

// Models
const User = require('./../models/userModel.js');

// Custom Errors
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require('./../errors');

// Utilities
const { attachCookiesToResponse } = require('./../utils/JWT.js');
const { createTokenUser } = require('./../utils/createTokenUser.js');
const { checkPermisions } = require('./../utils/ckeckPermissions.js');

// ==========================
// @desc    Get all users (with role "user")
// @route   GET /api/v1/users
// @access  Private (admin or similar)
// ==========================
module.exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({ role: 'user' })
    .select('-password -__v') // exclude sensitive fields
    .lean(); // return plain JS objects

  res.status(StatusCodes.OK).json({ length: users.length, users });
});

// ==========================
// @desc    Get single user by ID
// @route   GET /api/v1/users/:id
// @access  Private
// ==========================
module.exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id).select('-password -__v');

  if (!user) {
    throw new NotFoundError(`There is no user with this id: ${id}`);
  }

  checkPermisions(req.user, user);

  res.status(StatusCodes.OK).json({ user });
});

// ==========================
// @desc    Show currently logged in user
// @route   GET /api/v1/users/showMe
// @access  Private
// ==========================
module.exports.showCurrentUser = asyncHandler(async (req, res, next) => {
  res.status(StatusCodes.OK).json({ user: req.user });
});

// ==========================
// @desc    Update user email & name
// @route   PUT /api/v1/users/updateUser
// @access  Private
// ==========================
module.exports.updateUser = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;

  if (!email || !name) {
    throw new BadRequestError('Name and email are required.');
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new NotFoundError('User not found.');
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
});

// ==========================
// @desc    Update user password
// @route   PUT /api/v1/users/updateUserPassword
// @access  Private
// ==========================
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
  const tokenUser = createTokenUser({ user });

  // 🍪 Send new token cookie
  attachCookiesToResponse({ res, tokenUser });

  // ✅ Send response
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Your password has been updated successfully.' });
});
