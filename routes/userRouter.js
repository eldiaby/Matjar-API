const userController = require(`./../controllers/userController.js`);

const exprees = require(`express`);

const router = exprees.Router();

router.route(`/`).get(userController.getAllUsers);

router.route(`/showMe`).get(userController.showCurrentUser);

router.route(`/updateUser`).patch(userController.updateUser);
router.route(`/updateUserPassword`).patch(userController.updateUserPassword);

router.route(`/:id`).get(userController.getUser);

module.exports = router;
