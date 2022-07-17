const apiError = require('../error/apiError');
const { Brand } = require('../models/models');

class brandController {
	async create(req, res, next) {
		const { name } = req.body;

		const candidate = await Brand.findOne({ where: name });

		if (candidate) {
			// next(apiError.)
		}

		const type = await Brand.create({ name });
		return res.json(type);
	}

	async getAll(req, res) {
		const brands = await Brand.findAll();
		return res.json(brands);
	}
}

module.exports = new brandController();
