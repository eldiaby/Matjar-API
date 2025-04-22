const userController = require(`./../controllers/userController.js`);

const exprees = require(`express`);
const {
  authenticateUser,
} = require(`../middleware/authenticationMiddleware.js`);

const {
  authorizePermission,
} = require(`./../middleware/authorizationMiddleware.js`);

const router = exprees.Router();

router.route(`/`).get(authenticateUser, userController.getAllUsers);

router.route(`/showMe`).get(authenticateUser, userController.showCurrentUser);

router.route(`/updateUser`).patch(userController.updateUser);
router.route(`/updateUserPassword`).patch(userController.updateUserPassword);

router
  .route(`/:id`)
  .get(
    authenticateUser,
    authorizePermission('admin', 'owner'),
    userController.getUser
  );

module.exports = router;
