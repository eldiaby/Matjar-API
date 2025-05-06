// ==========================
// IMPORTS & DEPENDENCIES
// ==========================

// Node packages
const crypto = require('node:crypto');

// Models
const User = require('./../models/userModel.js');

// Packages
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');

// Utilities
const { attachCookiesToResponse } = require('./../utils/JWT.js');
const { createTokenUser } = require('./../utils/createTokenUser.js');
const sendVerificationEmail = require('./../utils/sendingEmails/sendVerificationEmail.js');

// Custom Errors
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require('./../errors');

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
      'Please provide name, email, password, and password confirmation.'
    );
  }

  // 🔍 Check if email already exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new BadRequestError('This email is already registered.');
  }

  // 🔑 Generate verification token
  const verificationToken = crypto.randomBytes(40).toString('hex');

  // 🛠 Create new user
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    verificationToken,
  });

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin: `http://localhost:5000`,
  });

  // 📤 Send verification response
  res.status(StatusCodes.CREATED).json({
    message:
      "Registration successful! Please check your inbox—we've sent you a verification email to activate your account.",
  });
});

// ==========================
// @desc    Verify user's email
// @route   POST /api/v1/auth/verify-email
// @access  Public
// ==========================
module.exports.verifyEmail = asyncHandler(async (req, res, next) => {
  // 📥 Extract verification token and email
  const { verificationToken, email } = req.body;

  // 🔍 Find user by email
  const user = await User.findOne({ email });

  // ⛔ User not found or invalid token
  if (!user || user.verificationToken !== verificationToken) {
    throw new NotFoundError(
      'Verification failed. The token is invalid or has already been used.'
    );
  }

  // ✅ Update user verification status

  user.verification();
  await user.save();

  // 📤 Respond with success
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Your email has been successfully verified. You can now log in.',
  });
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

  // ⛔ Invalid credentials
  if (!user || !(await user.compareUserPassword(password))) {
    throw new UnauthenticatedError('Invalid email or password.');
  }

  // ⛔ Email not verified
  if (!user.isVerified) {
    throw new UnauthenticatedError(
      'Access denied. Please verify your email to continue. Check your inbox for the verification link.'
    );
  }

  // 🎫 Generate token payload
  const tokenUser = createTokenUser({ user });

  // 🍪 Attach token as cookie
  attachCookiesToResponse({ res, tokenUser });

  // ✅ Send login success response
  res.status(StatusCodes.OK).json({
    user: tokenUser,
    message: 'Login successful!',
  });
});

// ==========================
// @desc    Logout user
// @route   GET /api/v1/auth/logout
// @access  Public or Private
// ==========================
module.exports.logout = asyncHandler(async (req, res, next) => {
  // 🍪 Clear the auth cookie
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  // ✅ Send logout success response
  res.status(StatusCodes.OK).json({
    message: 'You have been logged out successfully.',
  });
});
