// ==========================
// IMPORTS & DEPENDENCIES
// ==========================
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');

// Models
const Review = require('./../models/reviewModel.js');
const Product = require('./../models/productModel.js');

// Custom Errors
const CustomError = require('./../errors');

// ==========================
// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @access  Public
// ==========================
module.exports.getAllReviews = asyncHandler(async (req, res, next) => {
  // Fetch all reviews from the database with .lean() for better performance
  const reviews = await Review.find({}).lean();

  // Return the reviews with the total count
  res.status(StatusCodes.OK).json({ length: reviews.length, reviews });
});

// ==========================
// @desc    Get single review by ID
// @route   GET /api/v1/reviews/:id
// @access  Public
// ==========================
module.exports.getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Check if the ID is provided in the request
  if (!id) {
    throw new CustomError.BadRequestError('Review ID is required');
  }

  // Attempt to find the review by its ID with .lean() for better performance
  const review = await Review.findById(id).lean();

  // If the review doesn't exist, throw an error
  if (!review) {
    throw new CustomError.NotFoundError(`No review found with ID: ${id}`);
  }

  // Return the found review
  res.status(StatusCodes.OK).json({ review });
});

// ==========================
// @desc    Create new review
// @route   POST /api/v1/reviews
// @access  Private (authenticated users only)
// ==========================
module.exports.createReview = asyncHandler(async (req, res, next) => {
  const { product: productId } = req.body;
  const userId = req.user.userId;

  // Check if the product exists
  const productExists = await Product.findOne({ _id: productId }).lean();
  if (!productExists) {
    throw new CustomError.NotFoundError(
      'No product found with the provided ID'
    );
  }

  // Check if the user has already reviewed this product
  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: userId,
  }).lean();
  if (alreadyReviewed) {
    throw new CustomError.BadRequestError(
      'You have already reviewed this product. Please update your review.'
    );
  }

  // Create a new review
  const review = await Review.create({ ...req.body, user: userId });

  // Return the created review
  res.status(StatusCodes.CREATED).json({ review });
});

// ==========================
// @desc    Update review by ID
// @route   PUT /api/v1/reviews/:id
// @access  Private (authenticated users or admin)
// ==========================
module.exports.updateReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Check if the review exists
  const review = await Review.findById(id).lean();
  if (!review) {
    throw new CustomError.NotFoundError('No review found with the provided ID');
  }

  // Check if the user has permission to update the review
  checkPermissions(req.user, review.user);

  // Update the review
  const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).lean();

  // Return the updated review
  res.status(StatusCodes.OK).json({ review: updatedReview });
});

// ==========================
// @desc    Delete review by ID
// @route   DELETE /api/v1/reviews/:id
// @access  Private (authenticated users or admin)
// ==========================
module.exports.deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Check if the review exists
  const review = await Review.findById(id).lean();
  if (!review) {
    throw new CustomError.NotFoundError('No review found with the provided ID');
  }

  // Check if the user has permission to delete the review
  checkPermissions(req.user, review.user);

  // Delete the review
  await Review.findByIdAndDelete(id);

  // Return a response after the review is deleted
  res
    .status(StatusCodes.NO_CONTENT)
    .json({ msg: 'Review deleted successfully' });
});
