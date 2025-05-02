// ==========================
// IMPORTS & DEPENDENCIES
// ==========================

// Packages
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');

// Models
const Order = require('./../models/orderModel.js');
const Product = require('./../models/productModel.js');

// Custom Errors
const CustomError = require('./../errors');
const { checkPermissions } = require('../utils/ckeckPermissions.js');

// local functions
const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'FakeSecretAPIKey';

  return { client_secret, amount };
};

// Exported functions
module.exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({});

  res.status(StatusCodes.OK).json({ length: orders.length, orders });
});

module.exports.getSingleOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new CustomError.NotFoundError(`No order found with ID: ${req.id}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
});

module.exports.getCurrentUserOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json({ length: orders.length, orders });
});

module.exports.createOrder = asyncHandler(async (req, res, next) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  // Check if cart items exist
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('No cart items provided.');
  }

  // Check if tax and shipping fee are provided
  if (tax == null || shippingFee == null) {
    throw new CustomError.BadRequestError(
      'Please provide both tax and shipping fee.'
    );
  }

  let orderItems = [];
  let subTotal = 0;

  for (const item of cartItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new CustomError.NotFoundError(
        `No product found with ID: ${item.product}`
      );
    }

    if (product.inventory < item.amount) {
      throw new CustomError.BadRequestError(
        `Not enough items in stock for product '${product.name}'. Only ${product.inventory} left.`
      );
    }

    const { price, name, image, _id } = product;

    // Add formatted order item
    orderItems.push({ price, name, image, amount: item.amount, product: _id });

    subTotal += price * item.amount;
  }

  const total = subTotal + tax + shippingFee;

  const paymentIntemt = await fakeStripeAPI({
    amount: total,
    currency: 'usd',
  });

  const order = await Order.create({
    orderItems,
    total,
    subTotal,
    tax,
    shippingFee,
    clientSecret: paymentIntemt.client_secret,
    user: req.user.userId,
  });

  // Update the products inventory
  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    product.inventory -= item.amount;
    await product.save();
  }

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
});

module.exports.updateOrder = asyncHandler(async (req, res, next) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
  await order.save();

  res.status(StatusCodes.OK).json({ order });
});
