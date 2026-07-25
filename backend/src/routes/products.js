const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

router.get('/', productController.getAllProducts);
router.get('/:slug', productController.getProductBySlug);

router.post('/', authMiddleware.authenticate, authMiddleware.authorize('ADMIN', 'SELLER'), productController.createProduct);
router.put('/:id', authMiddleware.authenticate, authMiddleware.authorize('ADMIN', 'SELLER'), productController.updateProduct);
router.delete('/:id', authMiddleware.authenticate, authMiddleware.authorize('ADMIN'), productController.deleteProduct);

module.exports = router;
