const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.post('/save', isLoggedIn, isAdmin, userController.createUser);
router.get('/all', isLoggedIn, isAdmin, userController.getAllUsers);
router.get('/:id', isLoggedIn, isAdmin, userController.getUserById);
router.put('/update/:id', isLoggedIn, isAdmin, userController.updateUser);
router.delete('/:id', isLoggedIn, isAdmin, userController.deleteUser);

module.exports = router;
