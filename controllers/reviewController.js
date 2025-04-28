const asyncHandler = require('express-async-handler');
const CustomeError = require('./../errors');
const Review = require('./../models/reviewModel.js');
const Product = require('./../models/productModel.js');
const { StatusCodes } = require('http-status-codes');
const { checkPermisions } = require('./../utils/ckeckPermissions.js');

module.exports.getAllReviews = asyncHandler(async (req, res, next) => {
  res.send('Get All Reviews');
});

module.exports.getReview = asyncHandler(async (req, res, next) => {
  res.send('Get Review');
});

module.exports.createReview = asyncHandler(async (req, res, next) => {
  const { product: productId } = req.body;
  const userId = req.user.userId;

  // Check if product exists
  const productExists = await Product.findOne({ _id: productId });
  if (!productExists) {
    throw new CustomError.NotFoundError(
      'No product found with the provided ID.'
    );
  }

  // Check if the user already reviewed this product
  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: userId,
  });
  if (alreadyReviewed) {
    throw new CustomError.BadRequestError(
      'You have already submitted a review for this product. Please update your existing review.'
    );
  }

  // Create new review
  const review = await Review.create({ ...req.body, user: userId });

  res.status(StatusCodes.CREATED).json({ review });
});

module.exports.updateReview = asyncHandler(async (req, res, next) => {
  res.send('update Review');
});

module.exports.deleteReview = asyncHandler(async (req, res, next) => {
  res.send('delete Review');
});
