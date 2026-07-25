const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.get('/profile', authMiddleware.authenticate, userController.getProfile);
router.put('/profile', authMiddleware.authenticate, userController.updateProfile);
router.put('/password', authMiddleware.authenticate, userController.changePassword);

module.exports = router;
