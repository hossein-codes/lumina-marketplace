const express = require('express');
const router = express.Router();
const c = require('../controllers/adminController');
const auth = require('../middleware/auth');

router.use(auth.authenticate, auth.authorize('ADMIN'));

router.get('/stats', c.stats);
router.get('/users', c.listUsers);
router.put('/users/:id', c.updateUser);
router.get('/orders', c.listOrders);
router.put('/orders/:id', c.updateOrderStatus);

module.exports = router;
