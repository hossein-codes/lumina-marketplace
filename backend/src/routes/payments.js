const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.authenticate);

router.post('/', paymentController.createPayment);
router.put('/:id/confirm', authMiddleware.authorize('ADMIN', 'SELLER'), paymentController.confirmPayment);
router.get('/order/:orderId', paymentController.getPaymentByOrder);

module.exports = router;
