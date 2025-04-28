const asyncHandler = require('express-async-handler');

module.exports.getAllReviews = asyncHandler(async (req, res, next) => {
  res.send('Get All Reviews');
});

module.exports.getReview = asyncHandler(async (req, res, next) => {
  res.send('Get Review');
});

module.exports.createReview = asyncHandler(async (req, res, next) => {
  res.send('create Review');
});

module.exports.updateReview = asyncHandler(async (req, res, next) => {
  res.send('update Review');
});

module.exports.deleteReview = asyncHandler(async (req, res, next) => {
  res.send('delete Review');
});
