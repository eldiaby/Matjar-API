const mongoose = require('mongoose');

// 🛒 Sub-schema for each cart item in the order
const singleOrderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name must be provided.'],
  },
  image: {
    type: String,
    required: [true, 'Product image must be provided.'],
  },
  price: {
    type: Number,
    required: [true, 'Product price must be provided.'],
    min: [1, 'Product price must be at least 1.'],
  },
  amount: {
    type: Number,
    required: [true, 'Product quantity must be provided.'],
    min: [1, 'Product quantity must be at least 1.'],
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product reference is required.'],
  },
});

const orderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: [true, 'Tax amount is required.'],
      min: [0, 'Tax must be a positive number.'],
      default: 0,
    },
    shippingFee: {
      type: Number,
      required: [true, 'Shipping fee is required.'],
      min: [0, 'Shipping fee must be a positive number.'],
      default: 0,
    },
    subTotal: {
      type: Number,
      required: [true, 'Order subtotal is required.'],
      min: [0, 'Subtotal must be a positive number.'],
    },
    total: {
      type: Number,
      required: [true, 'Order total is required.'],
      min: [0, 'Total must be a positive number.'],
    },
    orderItems: {
      type: [singleOrderItemSchema],
      required: [true, 'At least one order item must be included.'],
      validate: {
        validator: (items) => items.length > 0,
        message: 'Order must contain at least one item.',
      },
    },
    status: {
      type: String,
      trim: true,
      enum: {
        values: ['pending', 'paid', 'failed', 'deliverd', 'canceled'],
        message: 'Invalid order status: {VALUE}',
      },
      default: 'pending',
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID must be provided.'],
    },
    clientSecret: {
      type: String,
      trim: true,
      required: [true, 'Client secret is required.'],
    },
    paymentId: {
      type: String,
      trim: true,
      // Optional: You can make it required later when payment is confirmed
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
