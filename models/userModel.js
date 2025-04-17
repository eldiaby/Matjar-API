const mongoose = require(`mongoose`);
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        'The user name is required. Please provide a valid name with at least 3 characters.',
      ],
      minlength: [3, 'The user name must be at least 3 characters long.'],
      maxlength: [30, 'The user name must not exceed 30 characters.'],
      trim: true,
    },
    email: {
      type: String,
      required: [
        true,
        'The email address is required. Please provide a valid email address.',
      ],
      validate: {
        validator: validator.isEmail,
        message:
          'Please provide a valid email address (e.g., user@example.com).',
      },
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [
        true,
        'The password is required. Please create a strong password.',
      ],
      minlength: [6, 'Password must be at least 6 characters long.'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
