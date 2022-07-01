const apiError = require('../error/apiError');
const { Basket } = require('../models/models');

class basketController {
	async addProduct(req, res, next) {
		try {
			const { userId, productId } = req.body;

			const basket = await Basket.create({ userId, productId });

			return res.json({ basket });
		} catch (error) {
			next(apiError(400, '31134413'));
		}
	}
}
