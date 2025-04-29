const mongoose = require('mongoose');
const Review = require(`./../models/reviewModel.js`);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Product name is required'],
      minlength: [3, 'Product name must be at least 3 characters long'],
      maxlength: [30, 'Product name must not exceed 30 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [1, 'Price must be at least $1'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [1000, 'Product description must not exceed 1000 characters'],
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported',
      },
    },
    colors: {
      type: [String],
      required: [true, 'Please provide at least one product color'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Average rating cannot be less than 0'],
      max: [5, 'Average rating cannot exceed 5'],
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

productSchema.post('findOneAndDelete', async function (doc) {
  if (doc) await Review.deleteMany({ product: doc._id });
});

module.exports = mongoose.model('Product', productSchema);
