const apiError = require('../error/apiError');
const {
	BasketProduct,
	Product,
	ProductInfo,
	Brand,
	Type,
	Sizes,
} = require('../models/models');

class basketController {
	async create(req, res, next) {
		try {
			const { productId, sizeId } = req.body;

			BasketProduct.create({
				basketId: req.user.id,
				productId,
				sizeId,
			}).then(async () => {
				const basket = await BasketProduct.findOne({
					where: { basketId: req.user.id, sizeId },
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
						{
							model: Sizes,
						},
					],
				});
				return res.json(basket);
			});
		} catch (error) {
			next(apiError(400, '31134413'));
		}
	}

	async deleteOne(req, res, next) {
		try {
			const { id } = req.body;

			BasketProduct.destroy({
				where: { id },
			});

			return res.json({ status: 'ok' });
		} catch (error) {
			next(apiError(400, 'failed'));
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
					{ model: Sizes },
				],
			});

			return res.json(basket);
		} catch (error) {
			console.log(error);
			next(apiError(400, '31134413'));
		}
	}
}

module.exports = new basketController();
