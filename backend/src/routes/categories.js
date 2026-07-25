const express = require('express');
const router = express.Router();
const c = require('../controllers/categoryController');
const auth = require('../middleware/auth');

router.get('/', c.list);
router.get('/:slug', c.getBySlug);
router.post('/', auth.authenticate, auth.authorize('ADMIN'), c.create);
router.put('/:id', auth.authenticate, auth.authorize('ADMIN'), c.update);
router.delete('/:id', auth.authenticate, auth.authorize('ADMIN'), c.remove);

module.exports = router;
