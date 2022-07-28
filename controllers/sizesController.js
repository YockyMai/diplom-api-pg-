const { Sizes, ProductSize, Product } = require('../models/models');

class sizesController {
	async create(req, res) {
		const { productId, sizesData } = req.body;
		if (productId) {
			sizesData.forEach(async sizeObj => {
				const sizeCandidate = await ProductSize.findOne({
					where: {
						productId,
						sizeId: sizeObj.sizeId,
					},
				});

				if (!sizeCandidate) {
					const productSize = await ProductSize.create({
						sizeId: sizeObj.sizeId,
						count: sizeObj.count,
						productId: productId,
					});

					Product.update(
						{
							productSizeId: productSize.id,
						},
						{
							where: {
								id: productId,
							},
						},
					);
				} else {
					const productSize = await ProductSize.update(
						{
							sizeId: sizeObj.sizeId,
							count: sizeObj.count,
							productId: productId,
						},
						{
							where: {
								sizeId: sizeObj.sizeId,
								productId: productId,
							},
						},
					);

					Product.update(
						{
							productSizeId: productSize.id,
						},
						{
							where: {
								id: productId,
							},
						},
					);
				}
			});

			return res.json({ message: 'ok' });
		}
	}

	async createIntance(req, res) {
		const { size } = req.body;

		const canditade = await Sizes.findOne({ where: { size } });

		console.log(canditade);
		if (canditade) {
			return res.json({
				message: `Такой размер уже существует в базе данных!`,
				status: 'error',
			});
		}

		Sizes.create({ size });

		return res.json({
			message: `Экземпляр размера успешно создан!`,
			status: 'ok',
		});
	}

	async getAll(req, res) {
		const sizes = await Sizes.findAll();

		return res.json(sizes);
	}
}

module.exports = new sizesController();
