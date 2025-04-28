const asyncHandler = require('express-async-handler');
const CustomeError = require('./../errors');
const Review = require('./../models/reviewModel.js');
const Product = require('./../models/productModel.js');
const { StatusCodes } = require('http-status-codes');
const { checkPermissions } = require('./../utils/ckeckPermissions.js');

module.exports.getAllReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({});

  res.status(StatusCodes.OK).json({ length: reviews.length, reviews });
});

module.exports.getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
    throw new CustomeError.NotFoundError('There is no review with this ID.');
  }

  res.status(StatusCodes.OK).json({ review });
});

module.exports.createReview = asyncHandler(async (req, res, next) => {
  const { product: productId } = req.body;
  const userId = req.user.userId;

  // Check if product exists
  const productExists = await Product.findOne({ _id: productId });
  if (!productExists) {
    throw new CustomeError.NotFoundError(
      'No product found with the provided ID.'
    );
  }

  // Check if the user already reviewed this product
  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: userId,
  });
  if (alreadyReviewed) {
    throw new CustomeError.BadRequestError(
      'You have already submitted a review for this product. Please update your existing review.'
    );
  }

  // Create new review
  const review = await Review.create({ ...req.body, user: userId });

  res.status(StatusCodes.CREATED).json({ review });
});

module.exports.updateReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    throw new CustomError.NotFoundError(
      'No review found with the provided ID.'
    );
  }

  checkPermissions(req.user, review.user);

  const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ review: updatedReview });
});

module.exports.deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    throw new CustomeError.NotFoundError(
      'No review found with the provided ID.'
    );
  }

  checkPermissions(req.user, review.user);

  await Review.findByIdAndDelete(id);

  res
    .status(StatusCodes.NO_CONTENT)
    .json({ msg: 'Review deleted successfully.' });
});
