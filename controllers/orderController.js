const {
	Order,
	BasketProduct,
	ProductSize,
	OrderProducts,
	Product,
	Sizes,
	ProductInfo,
	Brand,
	Type,
	Basket,
} = require('../models/models');
const { literal } = require('sequelize');
const apiError = require('../error/apiError');

class orderController {
	async create(req, res, next) {
		try {
			const {address} = req.body;
			const order = await Order.create({ userId: req.user.id, address });
			const orderItems = await BasketProduct.findAll({
				where: { basketId: req.user.id },
			});

			orderItems.forEach(element => {
				ProductSize.update(
					{ count: literal('count - 1') },
					{
						where: {
							productId: element.productId,
							sizeId: element.sizeId,
						},
					},
				);

				OrderProducts.create({
					orderId: order.id,
					productId: element.productId,
					sizeId: element.sizeId,
				});
			});

			const basket = await Basket.findOne({
				where: {
					userId: req.user.id,
				},
			});

			BasketProduct.destroy({
				where: {
					basketId: basket.id,
				},
			});

			return res.json({ status: 'ok' });
		} catch (error) {
			console.log(error);
		}
	}

	async get(req, res, next) {
		try {
			const orders = await Order.findAll({
				where: { userId: req.user.id },
				include: [
					{
						model: OrderProducts,

						include: [
							{
								model: Product,
								include: [
									{ model: ProductInfo, as: 'info' },
									{ model: Brand },
									{ model: Type },
								],
							},
							{ model: Sizes },
						],
					},
				],
			});

			return res.json(orders);
		} catch (error) {
			next(apiError.badRequest(error.message));
		}
	}
}

module.exports = new orderController();
