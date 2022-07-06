const Router = require('express');
const sizesController = require('../controllers/sizesController');
const router = new Router();

router.post('/', sizesController.create);
router.get('/', sizesController.getAll);

module.exports = router;
