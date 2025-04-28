// ===========================
// External Modules
// ===========================
const express = require('express');

// ===========================
// Middleware
// ===========================
const {
  authenticateUser,
} = require('../middleware/authenticationMiddleware.js');
const {
  authorizePermission,
} = require('../middleware/authorizationMiddleware.js');

// ===========================
// Controllers
// ===========================
const reviewController = require('../controllers/reviewController.js');

// ===========================
// Init Router
// ===========================
const router = express.Router();

// ===========================
// Routes
// ===========================

// Public routes
router
  .route('/')
  .get(reviewController.getAllReviews) // Get all reviews (public)
  .post(authenticateUser, reviewController.createReview); // Create a review (requires login)

router.route('/:id').get(reviewController.getReview); // Get single review by ID (public)

// Apply authentication to all routes below
router.use(authenticateUser);

// Protected routes
router
  .route('/:id')
  .patch(reviewController.updateReview) // Update a review (requires login)
  .delete(reviewController.deleteReview); // Delete a review (requires login)

module.exports = router;
