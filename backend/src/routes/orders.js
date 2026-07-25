const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware.authenticate, orderController.createOrder);
router.get('/', authMiddleware.authenticate, orderController.getMyOrders);
router.get('/:id', authMiddleware.authenticate, orderController.getOrderById);

module.exports = router;
