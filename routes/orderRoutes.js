const express = require('express');
const orderController = require('./../controllers/orderController.js');

// Middleware
const {
  authenticateUser,
} = require('../middleware/authenticationMiddleware.js');
const {
  authorizePermission,
} = require('../middleware/authorizationMiddleware.js');

const router = express.Router();

router.use(authenticateUser);

router
  .route('/')
  .get(authorizePermission('admin'), orderController.getAllOrders)
  .post(orderController.createOrder);

router.route('/showAllMyOrders').get(orderController.getCurrentUserOrders);

router
  .route('/:id')
  .get(orderController.getSingleOrder)
  .patch(orderController.updateOrder);

module.exports = router;
