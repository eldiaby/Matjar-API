const asyncHandler = require(`express-async-handler`);

// Models
const User = require('./../models/userModel.js');

// Other paskeges
const { StatusCodes } = require(`http-status-codes`);

// Utilites
const { attackCookiesToResponse } = require(`./../utils/JWT.js`);
const { BadRequestError } = require(`./../errors`);

// Register functionality
module.exports.register = asyncHandler(async (req, res, next) => {
  //  Extract user data from the request body
  const { name, email, password, passwordConfirm } = req.body;

  // Validate required fields
  if (!name || !email || !password || !passwordConfirm) {
    throw new BadRequestError(
      'Please provide name, email, password, and password confirmation'
    );
  }

  // Check if the email already exists in the database
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new BadRequestError('Email already exists');
  }

  // Create new user in the database
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  // Prepare token payload (exclude sensitive data like password)
  const tokenUser = {
    userId: newUser._id,
    name: newUser.name,
    role: newUser.role,
  };

  attackCookiesToResponse({ res, tokenUser });

  // Send success response with user data (without password)
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
});

module.exports.login = asyncHandler(async (req, res, next) => {
  res.send(`<h1>This id login Route</h1>`);
});
module.exports.logout = asyncHandler(async (req, res, next) => {
  res.send(`<h1>This id logout Route</h1>`);
});
