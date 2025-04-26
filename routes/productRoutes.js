// ==========================
// 📦 IMPORTS & DEPENDENCIES
// ==========================

const express = require('express');
const router = express.Router();

// Middleware
const {
  authenticateUser,
} = require('../middleware/authenticationMiddleware.js');
const {
  authorizePermission,
} = require('../middleware/authorizationMiddleware.js');

// Controllers
const productController = require('../controllers/productController.js');

// ==========================
// 🛣️ PRODUCT ROUTES
// ==========================

/**

@desc Get all products / Create new product

@route GET /api/v1/products

@route POST /api/v1/products

@access Public / Private (admin only) */
router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authenticateUser,
    authorizePermission('admin'),
    productController.createProduct
  );

/**

@desc Upload product image

@route POST /api/v1/products/uploadImage

@access Private (admin only) */
router
  .route('/uploadImage')
  .post(
    authenticateUser,
    authorizePermission('admin'),
    productController.uploadImage
  );

/**

@desc Get / Update / Delete single product

@route GET /api/v1/products/:id

@route PATCH /api/v1/products/:id

@route DELETE /api/v1/products/:id

@access Public / Private (admin only) */
router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authenticateUser,
    authorizePermission('admin'),
    productController.updateProduct
  )
  .delete(
    authenticateUser,
    authorizePermission('admin'),
    productController.deleteProduct
  );

// ==========================
// 📤 EXPORT ROUTER
// ==========================

module.exports = router;
