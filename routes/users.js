const router = require('express').Router();
const userController = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', userController.getUsers);

router.get('/:userId', userController.getUserById);

router.post('/signup', userController.signupUser);

router.post('/login', userController.loginUser);

router.put('/:userId', requireAuth, userController.updateUser);

router.get('/logout', userController.logoutUser);

router.delete('/:userId', requireAuth, requireAdmin, userController.deleteUser);

module.exports = router;
