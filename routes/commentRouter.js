const Router = require('express');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
const router = Router();

router.post('/create', authMiddleware, commentController.create);
router.get('/product/:productId', commentController.getAll);
router.get('/stars/:productId/:userId', commentController.getCommentStars);

module.exports = router;
