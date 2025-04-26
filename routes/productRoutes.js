const express = require('express');
const router = express.Router();

const {
  authenticateUser,
} = require('../middleware/authenticationMiddleware.js');

const {
  authorizePermission,
} = require('../middleware/authorizationMiddleware.js');

const productController = require('./../controllers/productController.js');

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authenticateUser,
    authorizePermission('admin'),
    productController.createProduct
  );

router
  .route('/uploadImage')
  .post(
    authenticateUser,
    authorizePermission('admin'),
    productController.uploadImage
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .delete(
    authenticateUser,
    authorizePermission('admin'),
    productController.deleteProduct
  )
  .patch(
    authenticateUser,
    authorizePermission('admin'),
    productController.updateProduct
  );

module.exports = router;
