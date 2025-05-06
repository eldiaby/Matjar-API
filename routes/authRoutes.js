// ==========================
// 📦 IMPORTS & DEPENDENCIES
// ==========================

// Packages
const express = require('express');

// Controllers
const authController = require('../controllers/authController.js');

// ==========================
// 🚏 ROUTER SETUP
// ==========================

const router = express.Router();

// ==========================
// 🛣️ AUTH ROUTES
// ==========================

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @desc    Verify user's email
 * @route   POST /api/v1/auth/verify-email
 * @access  Public
 */
router.post('/verify-email', authController.verifyEmail);

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @desc    Logout user
 * @route   GET /api/v1/auth/logout
 * @access  Public
 */
router.get('/logout', authController.logout);

// ==========================
// 📤 EXPORT ROUTER
// ==========================

module.exports = router;
