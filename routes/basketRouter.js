const Router = require('express');
const basketController = require('../controllers/basketController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const router = new Router();

router.post('/create', authMiddleware, basketController.create);
router.get('/:id', authMiddleware, basketController.getOne);

module.exports = router;
