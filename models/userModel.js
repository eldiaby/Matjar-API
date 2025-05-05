const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password.'],
      validate: {
        // Custom validator to check if password and passwordConfirm match
        validator: function () {
          return this.password === this.passwordConfirm;
        },
        message: 'Password confirmation does not match password.',
      },
      trim: true,
      select: false, // Prevent this field from being returned in any query
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    verificationToken: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// 🔐 Encrypt the password before saving the user document
userSchema.pre('save', async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return;

  // Remove passwordConfirm before saving to DB
  this.passwordConfirm = undefined;

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔍 Method to compare entered password with the hashed password in DB
userSchema.methods.compareUserPassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
