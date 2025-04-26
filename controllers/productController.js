// ==========================
// IMPORTS & DEPENDENCIES
// ==========================

// Packages
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');

// Models
const Product = require('./../models/productModel.js');

// Custom Errors
const CustomError = require('./../errors');

// ==========================
// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
// ==========================
module.exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({}).lean();
  res.status(StatusCodes.OK).json({ length: products.length, products });
});

// ==========================
// @desc    Get single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
// ==========================
module.exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    throw new CustomError.BadRequestError('Product ID is required');
  }

  const product = await Product.findById(id).lean();

  if (!product) {
    throw new CustomError.NotFoundError(`No product found with ID: ${id}`);
  }

  res.status(StatusCodes.OK).json({ product });
});

// ==========================
// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private (admin only)
// ==========================
module.exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create({ ...req.body, user: req.user.userId });

  res.status(StatusCodes.CREATED).json({ product });
});

// ==========================
// @desc    Update product by ID
// @route   PUT /api/v1/products/:id
// @access  Private (admin only)
// ==========================
module.exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    throw new CustomError.BadRequestError('Product ID is required');
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) {
    throw new CustomError.NotFoundError(`No product found with ID: ${id}`);
  }

  res.status(StatusCodes.OK).json({ product: updatedProduct });
});

// ==========================
// @desc    Delete product by ID
// @route   DELETE /api/v1/products/:id
// @access  Private (admin only)
// ==========================
module.exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    throw new CustomError.BadRequestError('Product ID is required');
  }

  const product = await Product.findById(id).lean();

  if (!product) {
    throw new CustomError.NotFoundError(`No product found with ID: ${id}`);
  }

  await Product.findByIdAndDelete(id);

  res
    .status(StatusCodes.NO_CONTENT)
    .json({ msg: 'Product deleted successfully' });
});

module.exports.uploadImage = asyncHandler(async (req, res, next) => {
  res.send('<h1>Upload An Image</h1>');
});
