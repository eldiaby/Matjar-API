// ==========================
// 🧩 DEPENDENCIES
// ==========================
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// ==========================
// 🧾 USER SCHEMA DEFINITION
// ==========================
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
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password.'],
      validate: {
        validator: function () {
          return this.password === this.passwordConfirm;
        },
        message: 'Password confirmation does not match password.',
      },
      trim: true,
      select: false,
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
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// ==========================
// 🔐 SCHEMA HOOKS
// ==========================

/**
 * @hook
 * @desc Hashes the user's password before saving the document to the database.
 * It only hashes the password if it's new or modified.
 * Also removes `passwordConfirm` before saving.
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.passwordConfirm = undefined;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ==========================
// 🧠 INSTANCE METHODS
// ==========================

/**
 * @method compareUserPassword
 * @desc Compares the entered password with the hashed password stored in the database.
 * @param {string} candidatePassword - The password provided by the user during login.
 * @returns {Promise<boolean>} - Returns true if passwords match, false otherwise.
 */
userSchema.methods.compareUserPassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * @method verification
 * @desc Marks the user as verified and sets the verification timestamp.
 * Note: This method modifies the document but does NOT save it. You must call `.save()` after.
 */
userSchema.methods.verification = function () {
  this.isVerified = true;
  this.verifiedAt = Date.now();
  this.verificationToken = undefined;
};

// ==========================
// 📤 EXPORT USER MODEL
// ==========================
module.exports = mongoose.model('User', userSchema);
