const { Sizes, ProductSize, Product } = require('../models/models');

class sizesController {
	async create(req, res) {
		const { productId, sizesData } = req.body;

		// sizesInfo {
		// 	[{
		// 		sizeId,
		// 		count
		// 	}]
		// }

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

	async getAll(req, res) {}
}

module.exports = new sizesController();
