// ==========================
// IMPORTS & DEPENDENCIES
// ==========================
const asyncHandler = require('express-async-handler');

// Models
const User = require('./../models/userModel.js');

// Packages
const { StatusCodes } = require('http-status-codes');

// Utilities
const { attachCookiesToResponse } = require('./../utils/JWT.js');
const { createTokenUser } = require('./../utils/createTokenUser.js');

// Custom Errors
const { BadRequestError, UnauthenticatedError } = require('./../errors');

// ==========================
// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
// ==========================
module.exports.register = asyncHandler(async (req, res, next) => {
  // 📥 Extract user data from request body
  const { name, email, password, passwordConfirm } = req.body;

  // 🛑 Validate required fields
  if (!name || !email || !password || !passwordConfirm) {
    throw new BadRequestError(
      'Please provide name, email, password, and password confirmation'
    );
  }

  // 🔍 Check if email already exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new BadRequestError('Email already exists');
  }

  // 🛠 Create new user
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  // 🎫 Generate token payload
  const tokenUser = createTokenUser({ user });

  // 🍪 Attach token as cookie
  attachCookiesToResponse({ res, tokenUser });

  // ✅ Send response
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
});

// ==========================
// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
// ==========================
module.exports.login = asyncHandler(async (req, res, next) => {
  // 📥 Extract login credentials
  const { email, password } = req.body;

  // 🛑 Validate inputs
  if (!email || !password) {
    throw new BadRequestError('Please provide both email and password.');
  }

  // 🔍 Find user by email
  const user = await User.findOne({ email });

  // ⛔ Email not found
  if (!user) {
    throw new UnauthenticatedError('Invalid email or password.');
  }

  // 🔐 Compare passwords
  const isPasswordCorrect = await user.compareUserPassword(password);

  // ⛔ Password incorrect
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid email or password.');
  }

  // 🎫 Generate token payload
  const tokenUser = createTokenUser({ user });

  // 🍪 Attach token as cookie
  attachCookiesToResponse({ res, tokenUser });

  // ✅ Send success response
  res.status(StatusCodes.OK).json({ user: tokenUser });
});

// ==========================
// @desc    Logout user
// @route   GET /api/v1/auth/logout
// @access  Private (can also be public for simple logout)
// ==========================
module.exports.logout = asyncHandler(async (req, res, next) => {
  // 🍪 Clear the cookie by expiring it
  res.cookie('token', 'Logout', {
    httpOnly: true,
    expires: new Date(Date.now()), // expire immediately
  });

  // ✅ Respond with success
  res.status(StatusCodes.OK).json({ msg: 'User logged out successfully' });
});
