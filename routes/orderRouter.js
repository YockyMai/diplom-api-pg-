const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, orderController.create);
// router.get('/check', authMiddleware, orderController.check);
router.get('/', authMiddleware, orderController.get);

module.exports = router;
