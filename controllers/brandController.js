const apiError = require('../error/apiError');
const { Brand } = require('../models/models');

class brandController {
	async create(req, res, next) {
		const { name } = req.body;

		const candidate = await Brand.findOne({ where: { name } });

		if (candidate) {
			return res.json({
				message: `Бренд ${name} уже существует!`,
				status: 'error',
			});
		}

		Brand.create({ name });

		return res.json({
			message: `Бренд ${name} успешно добавлен!`,
			status: 'ok',
		});
	}

	async getAll(req, res) {
		const brands = await Brand.findAll();
		return res.json(brands);
	}

	async deleteBrand(req, res) {
		const { brandId } = req.body;

		Brand.destroy({ where: { id: brandId } });

		return res.json({
			message: `Бренд успешно удален!`,
			status: 'ok',
		});
	}
}

module.exports = new brandController();
