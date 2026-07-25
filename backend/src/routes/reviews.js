const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');

router.get('/product/:productId', reviewController.getReviewsByProduct);

router.use(authMiddleware.authenticate);
router.post('/', reviewController.createReview);
router.get('/me', reviewController.getMyReviews);

module.exports = router;
