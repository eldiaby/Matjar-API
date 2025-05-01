const asyncHandler = require('express-async-handler');

module.exports.getAllOrders = asyncHandler(async (req, res, next) => {
  res.send('This is get all orders route');
});
module.exports.getSingleOrder = asyncHandler(async (req, res, next) => {
  res.send('This is get single order route');
});
module.exports.getCurrentUserOrders = asyncHandler(async (req, res, next) => {
  res.send('This is get current user orders route');
});
module.exports.createOrder = asyncHandler(async (req, res, next) => {
  res.send('This is create  order route');
});
module.exports.updateOrder = asyncHandler(async (req, res, next) => {
  res.send('This is update  order route');
});
