const asyncHandler = require(`express-async-handler`);

module.exports.register = asyncHandler(async (req, res, next) => {
  res.send(`<h1>This id register Route</h1>`);
});

module.exports.login = asyncHandler(async (req, res, next) => {
  res.send(`<h1>This id login Route</h1>`);
});
module.exports.logout = asyncHandler(async (req, res, next) => {
  res.send(`<h1>This id logout Route</h1>`);
});
