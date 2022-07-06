const { Sizes } = require('../models/models');

class sizesController {
	async create(req, res) {
		const { sizes, productId } = req.body;

		if (productId && sizes) {
			sizes.forEach(async size => {
				const sizeCandidat = await Sizes.findAll({
					where: {
						productId,
						size,
					},
				});

				console.log(sizeCandidat);

				if (sizeCandidat.length <= 0) {
					Sizes.create({ size, productId });
				}
			});

			return res.json({ message: 'ok' });
		}
	}

	async getAll(req, res) {}
}

module.exports = new sizesController();
