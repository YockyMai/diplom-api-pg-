const Router = require('express');
const router = new Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/uploadimage', authMiddleware, productController.uploadImage);
router.post('/updateimage', productController.updateImage);
router.post('/edit', productController.edit);
router.get('/search', productController.getAllByTextSearch);
router.post('/', productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.post('/rating', authMiddleware, productController.addRating);
router.post(
	'/rating/check/:productId',
	authMiddleware,
	productController.checkRatingAccess,
);
router.get('/info/:productId', productController.getProductInfo);
router.post('/delete', authMiddleware, productController.deleteProduct);

module.exports = router;
