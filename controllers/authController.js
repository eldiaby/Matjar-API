// ==========================
// IMPORTS & DEPENDENCIES
// ==========================

// Node packages
const crypto = require('node:crypto');

// Models
const User = require('./../models/userModel.js');
const Token = require('./../models/tokenModel.js');

// Packages
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const ms = require('ms');

// Utilities
const { attachCookiesToResponse } = require('./../utils/JWT.js');
const { createTokenUser } = require('./../utils/createTokenUser.js');
const sendVerificationEmail = require('./../utils/sendingEmails/sendVerificationEmail.js');
const { createHash } = require('./../utils/createHash.js');

const sendResetPasswordEmail = require('./../utils/sendingEmails/sendResetPasswordEmail.js');

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

  // Create refresh token
  let refreshToken = ``;

  // check for existing token

  const existingToken = await Token.findOne({ user: user._id }).lean();

  if (existingToken) {
    const { isValid } = existingToken;

    if (!isValid) {
      throw new UnauthenticatedError('Invalid credentials.');
    }

    refreshToken = existingToken.refreshToken;

    // 🍪 Attach token as cookie
    attachCookiesToResponse({ res, tokenUser, refreshToken });

    // ✅ Send login success response
    res.status(StatusCodes.OK).json({
      user: tokenUser,
      message: 'Login successful!',
    });

    return;
  }

  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;

  const userToken = { refreshToken, userAgent, ip, user: user._id };

  await Token.create(userToken);

  // 🍪 Attach token as cookie
  attachCookiesToResponse({ res, tokenUser, refreshToken });

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
  await Token.findOneAndDelete({ user: req.user.userId });

  // 🍪 Clear the auth cookie
  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  // ✅ Send logout success response
  res.status(StatusCodes.NO_CONTENT).json({
    message: 'You have been logged out successfully.',
  });
});

////////////////////////////////////////////////////////////////////
// Forget password functionalities

// ==========================
// @desc    Send password reset link via email (if user exists)
// @route   POST /api/v1/auth/forgot-password
// @access  Public
//
// 🚨 Security Note:
// Whether the email exists or not, always respond with a success message.
// This prevents attackers from discovering which emails are registered (user enumeration).
// ==========================
module.exports.fotgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // 🛑 Check for email
  if (!email) {
    throw new BadRequestError('Please provide a valid email address.');
  }

  const user = await User.findOne({ email });

  if (user) {
    // 🔐 Generate raw reset token
    const rawToken = crypto.randomBytes(70).toString('hex');
    user.passwordToken = createHash(rawToken);

    // ⏰ Set token expiration
    user.passwordTokenExpirationDate = new Date(
      Date.now() + ms(process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN || '15m')
    );

    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      resetToken: rawToken,
    });

    await user.save();
  }

  // 📨 Always respond the same way to avoid user enumeration
  res.status(StatusCodes.OK).json({
    message: 'If the email is valid, you will receive a reset link shortly.',
  });
});

// ==========================
// @desc    Reset user password using valid reset token
// @route   POST /api/v1/auth/reset-password
// @access  Public
//
// 🚨 Security Note:
// Do not reveal whether the token is invalid because of email or token mismatch.
// Always respond with a generic error to protect against token probing or user discovery.
// ==========================
module.exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, token, password } = req.body;

  // 🛑 Validate input
  if (!email || !token || !password) {
    throw new BadRequestError('Email, token, and new password are required.');
  }

  const user = await User.findOne({ email });

  if (user) {
    const isTokenValid =
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > new Date();

    if (isTokenValid) {
      user.password = password;
      user.passwordToken = undefined;
      user.passwordTokenExpirationDate = undefined;

      await user.save();

      return res.status(StatusCodes.OK).json({
        message:
          'Your password has been reset successfully. You can now log in.',
      });
    }
  }

  throw new BadRequestError('Invalid or expired token.');
});
