const {
	Type,
	Product,
	ProductInfo,
	Brand,
	Sizes,
	ProductSize,
} = require('../models/models');
const { v4: uuidv4 } = require('uuid');
const apiError = require('../error/apiError');
const path = require('path');
const { Op } = require('sequelize');

class productController {
	async create(req, res, next) {
		try {
			const { name, price, brandId, typeId, info, sizes } = req.body;
			const { img } = req.files;

			let fileName = uuidv4() + '.jpg'; // generate uniq filename
			img.mv(path.resolve(__dirname, '..', 'static', fileName)); // move file in a static folder, * __dirname - current loication, next params - path to static folder *

			const product = await Product.create({
				name,
				price,
				brandId,
				typeId,
				img: fileName,
			});

			if (info) {
				info = JSON.parse(info); // form data not auto-parcing in json
				info.forEach(infoEl => {
					ProductInfo.create({
						title: infoEl.title,
						description: infoEl.description,
						productId: product.id,
					});
				});
			}

			return res.json(product);
		} catch (error) {
			next(apiError.badRequest(error.message));
		}
	}

	async getAll(req, res, next) {
		try {
			let {
				brandId,
				typeId,
				limit,
				page,
				minPrice,
				maxPrice,
				searchValue,
				sizeId,
			} = req.query;

			page = page || 1;
			limit = limit || 10;
			minPrice = minPrice || 0;
			maxPrice = maxPrice || 100000;
			let offset = limit * page - limit;

			let products;
			// TODO: Зделать посик по символам
			if (!brandId && !typeId) {
				products = await Product.findAndCountAll({
					limit,
					offset,
					include: [
						{ model: Type },
						{ model: Brand },
						{
							model: ProductSize,
							as: 'sizes',
							include: {
								model: Sizes,
							},
						},
					],
					where: {
						price: {
							[Op.between]: [minPrice, maxPrice],
						},
					},
				}); // resposing all counts of products
			}

			if (brandId && !typeId) {
				products = await Product.findAndCountAll({
					where: {
						brandId,
						price: {
							//[Op.lt]: maxPrice, // меньше чем
							//[Op.gt]: minPrice, // больше чем

							[Op.between]: [minPrice, maxPrice],
						},
					},
					include: [
						{ model: Type },
						{ model: Brand },

						{
							model: ProductSize,
							as: 'sizes',
							include: {
								model: Sizes,
							},
						},
					],
					distinct: true,
					limit,
					offset,
				});
			}

			if (!brandId && typeId) {
				products = await Product.findAndCountAll({
					where: {
						typeId,
						price: {
							[Op.between]: [minPrice, maxPrice],
						},
					},
					include: [
						{ model: Type },
						{ model: Brand },
						{
							model: ProductSize,
							as: 'sizes',
							include: {
								model: Sizes,
							},
						},
					],
					limit,
					offset,
				});
			}

			if (brandId && typeId) {
				products = await Product.findAndCountAll({
					where: {
						typeId,
						brandId,
						price: {
							[Op.between]: [minPrice, maxPrice],
						},
					},
					include: [
						{ model: Type },
						{ model: Brand },
						{
							model: ProductSize,
							as: 'sizes',
							include: {
								model: Sizes,
							},
						},
					],
					limit,
					offset,
				});
			}

			return res.json(products);
		} catch (error) {
			next(apiError.badRequest(error.message));
			console.log(error);
		}
	}

	async getOne(req, res, next) {
		try {
			const { id } = req.params;

			const product = await Product.findOne({
				where: { id },
				include: [
					{ model: ProductInfo, as: 'info' },
					{
						model: ProductSize,
						as: 'sizes',
						include: {
							model: Sizes,
						},
					},
					{ model: Type },
					{ model: Brand },
				], //left join
			});

			return res.json(product);
		} catch (error) {
			next(apiError.badRequest(error.message));
		}
	}
}

module.exports = new productController();
