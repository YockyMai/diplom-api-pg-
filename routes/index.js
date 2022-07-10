const Router = require('express');
const router = new Router();

const productRouter = require('./productRouter');
const brandRouter = require('./brandRouter');
const typeRouter = require('./typeRouter');
const userRouter = require('./userRouter');
const basketRouter = require('./basketRouter');
const sizesRouter = require('./sizesRouter');
const orderRouter = require('./orderRouter');
const commentRouter = require('./commentRouter');

router.use('/brand', brandRouter);
router.use('/product', productRouter);
router.use('/type', typeRouter);
router.use('/user', userRouter);
router.use('/basket', basketRouter);
router.use('/sizes', sizesRouter);
router.use('/order', orderRouter);
router.use('/comment', commentRouter);

module.exports = router;
