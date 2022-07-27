const { Type } = require('../models/models');

class typeController {
	async create(req, res) {
		const { name } = req.body;

		const candidate = await Type.findOne({ where: { name } });

		if (candidate) {
			return res.json({
				message: `Тип ${name} уже существует!`,
				status: 'error',
			});
		}

		Type.create({ name });

		return res.json({
			message: `Тип ${name} успешно добавлен!`,
			status: 'ok',
		});
	}

	async getAll(req, res) {
		const types = await Type.findAll();

		return res.json(types);
	}

	async deleteType(req, res) {
		const { typeId } = req.body;

		Type.destroy({ where: { id: typeId } });

		return res.json({
			message: `Тип успешно удален!`,
			status: 'ok',
		});
	}
}

module.exports = new typeController();
