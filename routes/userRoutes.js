// ==========================
// 📦 IMPORTS & DEPENDENCIES
// ==========================

const express = require('express');
const router = express.Router();

// Controllers
const userController = require('../controllers/userController.js');

// Middleware
const {
  authenticateUser,
} = require('../middleware/authenticationMiddleware.js');
const {
  authorizePermission,
} = require('../middleware/authorizationMiddleware.js');

// ==========================
// 🛣️ USER ROUTES
// ==========================

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private (admin only)
 */
router.route('/').get(authenticateUser, userController.getAllUsers);

/**
 * @desc    Show currently logged-in user
 * @route   GET /api/v1/users/showMe
 * @access  Private
 */
router.route('/showMe').get(authenticateUser, userController.showCurrentUser);

/**
 * @desc    Update user name and email
 * @route   PATCH /api/v1/users/updateUser
 * @access  Private
 */
router.route('/updateUser').patch(authenticateUser, userController.updateUser);

/**
 * @desc    Update user password
 * @route   PATCH /api/v1/users/updateUserPassword
 * @access  Private
 */
router
  .route('/updateUserPassword')
  .patch(authenticateUser, userController.updateUserPassword);

/**
 * @desc    Get user by ID (admin or resource owner only)
 * @route   GET /api/v1/users/:id
 * @access  Private (admin or owner)
 */
router
  .route('/:id')
  .get(
    authenticateUser,
    authorizePermission('admin', 'owner'),
    userController.getUser
  );

// ==========================
// 📤 EXPORT ROUTER
// ==========================

module.exports = router;
