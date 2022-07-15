const { Brand } = require('../models/models');

class brandController {
	async create(req, res) {
		const { name } = req.body;
		const type = await Brand.create({ name });
		return res.json(type);
	}

	async getAll(req, res) {
		const brands = await Brand.findAll();
		return res.json(brands);
	}
}

module.exports = new brandController();
