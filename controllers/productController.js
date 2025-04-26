const asyncHandler = require('express-async-handler');
const Product = require('./../models/productModel.js');
const { StatusCodes } = require('http-status-codes');

module.exports.getAllProducts = asyncHandler(async (req, res, next) => {
  res.send('<h1>Get All Products</h1>');
});

module.exports.getProduct = asyncHandler(async (req, res, next) => {
  res.send('<h1>Get A Products</h1>');
});

module.exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = req.body;
  product.user = req.user.userId;

  const insertedProduct = await Product.create(product);
  res.status(StatusCodes.CREATED).json({ insertedProduct });
});

module.exports.updateProduct = asyncHandler(async (req, res, next) => {
  res.send('<h1>Update A Products</h1>');
});

module.exports.deleteProduct = asyncHandler(async (req, res, next) => {
  res.send('<h1>Delete A Products</h1>');
});

module.exports.uploadImage = asyncHandler(async (req, res, next) => {
  res.send('<h1>Upload An Image</h1>');
});
