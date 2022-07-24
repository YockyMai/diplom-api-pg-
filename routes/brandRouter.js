const Router = require('express');
const brandController = require('../controllers/brandController');
const router = new Router();

router.post('/', brandController.create);
router.post('/delete', brandController.deleteBrand);
router.get('/', brandController.getAll);

module.exports = router;
