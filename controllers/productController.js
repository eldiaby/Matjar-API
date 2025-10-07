// ==========================
// IMPORTS & DEPENDENCIES
// ==========================

const path = require('node:path');
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Product = require('../models/productModel.js');
const CustomError = require('../errors');
const apiResponse = require('../utils/apiResponse.js');

// ==========================
// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
// ==========================
module.exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).lean();

  apiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Products fetched successfully',
    data: products,
  });
});

// ==========================
// @desc    Get single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
// ==========================
module.exports.getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new CustomError.BadRequestError('Product ID is required');
  }

  const product = await Product.findById(id).populate('reviews').lean();

  if (!product) {
    throw new CustomError.NotFoundError(`No product found with ID: ${id}`);
  }

  apiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Product fetched successfully',
    data: product,
  });
});

// ==========================
// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private (admin only)
// ==========================
module.exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, user: req.user.userId });

  apiResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Product created successfully',
    data: product,
  });
});

// ==========================
// @desc    Update product by ID
// @route   PUT /api/v1/products/:id
// @access  Private (admin only)
// ==========================
module.exports.updateProduct = asyncHandler(async (req, res) => {
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

  apiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Product updated successfully',
    data: updatedProduct,
  });
});

// ==========================
// @desc    Delete product by ID
// @route   DELETE /api/v1/products/:id
// @access  Private (admin only)
// ==========================
module.exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new CustomError.BadRequestError('Product ID is required');
  }

  const product = await Product.findById(id).lean();

  if (!product) {
    throw new CustomError.NotFoundError(`No product found with ID: ${id}`);
  }

  await Product.findByIdAndDelete(id);

  apiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Product deleted successfully',
    data: null,
  });
});

// ==========================
// @desc    Upload product image
// @route   POST /api/v1/products/uploadImage
// @access  Private (admin only)
// ==========================
module.exports.uploadImage = asyncHandler(async (req, res) => {
  const image = req.files?.image;
  if (!image) {
    throw new CustomError.BadRequestError('Please upload an image file');
  }

  if (!image.mimetype.startsWith('image/')) {
    throw new CustomError.BadRequestError('Only image files are allowed');
  }

  const maxSize = 1 * 1024 * 1024;
  if (image.size > maxSize) {
    throw new CustomError.BadRequestError('Image must be less than 1MB');
  }

  const imagePath = path.join(__dirname, '..', 'public', 'uploads', image.name);
  await image.mv(imagePath);

  apiResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Image uploaded successfully',
    data: { image: `/uploads/${image.name}` },
  });
});
