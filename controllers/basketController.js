const apiError = require('../error/apiError');
const {
	BasketProduct,
	Product,
	ProductInfo,
	Brand,
	Type,
} = require('../models/models');

class basketController {
	async create(req, res, next) {
		try {
			const { productId } = req.body;

			await BasketProduct.create({
				basketId: req.user.id,
				productId,
			});

			const basket = await BasketProduct.findOne({
				where: { basketId: req.user.id },
				attributes: {
					exclude: ['productId', 'basketId'], //exclude : исключить поля
				},
				include: [
					{
						model: Product,
						include: [
							{ model: ProductInfo, as: 'info' },
							{ model: Brand },
							{ model: Type },
						],
						where: {
							id: productId,
						},
					},
				],
			});

			return res.json(basket);
		} catch (error) {
			next(apiError(400, '31134413'));
		}
	}

	async getOne(req, res, next) {
		try {
			const { id } = req.params;

			console.log(id);

			const basket = await BasketProduct.findAll({
				where: { basketId: id },
				attributes: {
					exclude: ['productId', 'basketId'], //exclude : исключить поля
				},
				include: [
					{
						model: Product,
						include: [
							{ model: ProductInfo, as: 'info' },
							{ model: Brand },
							{ model: Type },
						],
					},
				],
			});

			return res.json(basket);
		} catch (error) {
			next(apiError(400, '31134413'));
		}
	}
}

module.exports = new basketController();
