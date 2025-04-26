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

@desc Register a new user

@route POST /api/v1/auth/register

@access Public */ router.route('/register').post(authController.register);

/**

@desc Login user

@route POST /api/v1/auth/login

@access Public */ router.route('/login').post(authController.login);

/**

@desc Logout user

@route GET /api/v1/auth/logout

@access Public */ router.route('/logout').get(authController.logout);

// ==========================
// 📤 EXPORT ROUTER
// ==========================

module.exports = router;
