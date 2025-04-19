const asyncHandler = require(`express-async-handler`);

module.exports.getAllUsers = asyncHandler(async (req, res, next) => {
  res.send(`<h1>Get All Users</h1>`);
});

module.exports.getUser = asyncHandler(async (req, res, next) => {
  res.send(`<h1>Get A Single User</h1>`);
});

module.exports.showCurrentUser = asyncHandler(async (req, res, next) => {
  res.send(`<h1>Show Current User</h1>`);
});

module.exports.updateUser = asyncHandler(async (req, res, next) => {
  res.send(`<h1>Update A Single User</h1>`);
});

module.exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  res.send(`<h1>Update User Password</h1>`);
});
