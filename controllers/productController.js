const {
	Type,
	Product,
	ProductInfo,
	Brand,
	Sizes,
	ProductSize,
	Rating,
} = require('../models/models');
const { v4: uuidv4 } = require('uuid');
const apiError = require('../error/apiError');
const path = require('path');
const { Op, literal } = require('sequelize');

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
					distinct: 'id',
					include: [
						{ model: Type },
						{ model: Brand },
						{
							model: ProductSize,
							as: 'sizes',
							include: {
								model: Sizes,
							},
							where: {
								count: {
									[Op.gt]: 0,
								},
								sizeId: {
									[sizeId ? Op.eq : Op.gt]: sizeId
										? sizeId
										: 0,
								},
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
							where: {
								count: {
									[Op.gt]: 0,
								},
								sizeId: {
									[sizeId ? Op.eq : Op.gt]: sizeId
										? sizeId
										: 0,
								},
							},
						},
					],
					distinct: 'id',
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
							where: {
								count: {
									[Op.gt]: 0,
								},
								sizeId: {
									[sizeId ? Op.eq : Op.gt]: sizeId
										? sizeId
										: 0,
								},
							},
						},
					],
					distinct: 'id',
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
							where: {
								count: {
									[Op.gt]: 0,
								},
								sizeId: {
									[sizeId ? Op.eq : Op.gt]: sizeId
										? sizeId
										: 0,
								},
							},
						},
					],
					distinct: 'id',
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

	async addRating(req, res, next) {
		try {
			const { rate, productId } = req.body;

			const candidate = await Rating.findOne({
				where: {
					userId: req.user.id,
				},
			});

			if (candidate) {
				return next(apiError.internal('Оценка уже поставлена'));
			}

			const rating = await Rating.create({
				userId: req.user.id,
				productId,
				rate,
			});

			const count = await Rating.count({ where: { productId } });

			Product.update(
				{ rating: literal('rating + 1') },
				{ where: { id: productId } },
			);

			const ratingCount = req;
		} catch (error) {
			next(apiError.badRequest(error.message));
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
