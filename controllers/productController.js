const asyncHandler = require('express-async-handler');
const Product = require('./../models/productModel.js');

module.exports.getAllProducts = asyncHandler(async (req, res, next) => {
  res.send('<h1>Get All Products</h1>');
});

module.exports.getProduct = asyncHandler(async (req, res, next) => {
  res.send('<h1>Get A Products</h1>');
});

module.exports.createProduct = asyncHandler(async (req, res, next) => {
  res.send('<h1>create A Products</h1>');
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
