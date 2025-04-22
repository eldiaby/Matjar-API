const CustomAPIError = require('./custom-api');
const UnauthenticatedError = require('./unauthenticated');
const UnauthorizedError = require('./unauthenticated.js');
const NotFoundError = require('./not-found');
const BadRequestError = require('./bad-request');
module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
};
