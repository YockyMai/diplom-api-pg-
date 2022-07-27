const Router = require('express');
const router = new Router();

const typeController = require('../controllers/typeController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/', checkRoleMiddleware('ADMIN'), typeController.create);
router.get('/', typeController.getAll);
router.post('/delete', typeController.deleteType);

module.exports = router;
