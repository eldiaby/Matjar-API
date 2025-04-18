const asyncHandler = require(`express-async-handler`);

const User = require('./../models/userModel.js');
const { StatusCodes } = require(`http-status-codes`);
const { BadRequestError } = require(`./../errors`);

module.exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError('All fields are required');
  }

  // if (!validator.isEmail(email)) {
  //   throw new BadRequestError('Invalid email format');
  // }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new BadRequestError('Email already exists');
  }

  const newUser = await User.create({ name, email, password });

  res.status(StatusCodes.CREATED).json({ user: newUser });
});

module.exports.login = asyncHandler(async (req, res, next) => {
  res.send(`<h1>This id login Route</h1>`);
});
module.exports.logout = asyncHandler(async (req, res, next) => {
  res.send(`<h1>This id logout Route</h1>`);
});
