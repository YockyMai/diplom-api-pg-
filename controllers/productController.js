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
const { Op, literal, fn, col, where } = require('sequelize');
const Sequelize = require('sequelize');
const { group } = require('console');

class productController {
	async create(req, res, next) {
		try {
			const { name, price, brandId, typeId, info, fileName } = req.body;
			// const { img } = req.files;

			// let fileName = uuidv4() + '.jpg'; // generate uniq filename
			// img.mv(path.resolve(__dirname, '..', 'static', fileName)); // move file in a static folder, * __dirname - current loication, next params - path to static folder *

			const product = await Product.create({
				name,
				price,
				brandId,
				typeId,
				img: fileName,
			});

			if (info) {
				const parcedInfo = JSON.parse(info); // form data not auto-parcing in json
				parcedInfo.forEach(infoEl => {
					ProductInfo.create({
						title: infoEl.title,
						description: infoEl.description,
						productId: product.id,
					});
				});
			}

			return res.json(product);
		} catch (error) {
			console.log(error);
			next(apiError.badRequest(error.message));
		}
	}

	async getAllByTextSearch(req, res) {
		try {
			let { query, sector } = req.query;

			sector = sector || 1;
			query = query.toLowerCase();

			let limit = 10;
			let offset = limit * sector - limit;

			const products = await Product.findAll({
				limit,
				offset,
				where: {
					name: Sequelize.where(
						Sequelize.fn('LOWER', Sequelize.col('product.name')),
						'LIKE',
						'%' + query + '%',
					),
				},
				include: [{ model: Type }, { model: Brand }, { model: Rating }],
			});

			return res.json(products);
		} catch (error) {
			console.log(error);
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
				sizeId,
				order,
			} = req.query;

			page = page || 1;
			limit = limit || 10;
			minPrice = minPrice || 0;
			maxPrice = maxPrice || 100000;
			order = order || 'priceDESC';

			let offset = limit * page - limit;

			let products;

			if (!brandId && !typeId) {
				products = await Product.findAndCountAll({
					limit,
					offset,
					distinct: 'id',
					order: [
						order === 'priceDESC'
							? ['price', 'DESC']
							: order === 'priceASC'
							? ['price', 'ASC']
							: order === 'ratingDESC'
							? ['rating', 'DESC']
							: order === 'ratingASC' && ['rating', 'ASC'],
					],
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
							[Op.between]: [minPrice, maxPrice],
						},
					},
					order: [
						order === 'priceDESC'
							? ['price', 'DESC']
							: order === 'priceASC'
							? ['price', 'ASC']
							: order === 'ratingDESC'
							? ['rating', 'DESC']
							: order === 'ratingASC' && ['rating', 'ASC'],
					],
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
					order: [
						order === 'priceDESC'
							? ['price', 'DESC']
							: order === 'priceASC'
							? ['price', 'ASC']
							: order === 'ratingDESC'
							? ['rating', 'DESC']
							: order === 'ratingASC' && ['rating', 'ASC'],
					],
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
					order: [
						order === 'priceDESC'
							? ['price', 'DESC']
							: order === 'priceASC'
							? ['price', 'ASC']
							: order === 'ratingDESC'
							? ['rating', 'DESC']
							: order === 'ratingASC' && ['rating', 'ASC'],
					],
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
					productId,
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
			const sum = await Rating.sum('rate', { where: { productId } });

			const updatedRating = sum / count;

			Product.update(
				{ rating: updatedRating },
				{ where: { id: productId } },
			);

			return res.json({ status: 'ok' });
		} catch (error) {
			next(apiError.badRequest(error.message));
		}
	}

	async checkRatingAccess(req, res, next) {
		try {
			const { productId } = req.params;

			const candidate = await Rating.findOne({
				where: {
					userId: req.user.id,
					productId,
				},
			});

			if (candidate) {
				return next(apiError.internal('Оценка уже поставлена'));
			}

			return res.json('ok');
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

	async uploadImage(req, res, next) {
		try {
			const { img } = req.files;

			let fileName = uuidv4() + '.jpg';
			img.mv(path.resolve(__dirname, '..', 'static', fileName));

			cloudinary.uploader.upload(
				path.resolve(__dirname, '..', 'static', fileName),
				function (error, result) {
					return res.json(result.url);
				},
			);
		} catch (error) {
			return next(apiError.internal(error));
		}
	}

	async updateImage(req, res, next) {
		try {
			const { productId, fileName } = req.body;

			const product = await Product.update(
				{
					img: fileName,
				},
				{
					where: {
						id: productId,
					},
				},
			);

			return res.json(product);
		} catch (error) {
			console.log(error);
			next(apiError.badRequest(error.message));
		}
	}

	async getProductInfo(req, res, next) {
		try {
			const { productId } = req.params;

			const productInfo = await ProductInfo.findAll({
				where: { productId },
			});

			return res.json(productInfo);
		} catch (error) {
			return next(apiError.internal(error));
		}
	}

	async deleteProduct(req, res, next) {
		try {
			const { productId } = req.body;

			const status = await Product.destroy({ where: { id: productId } });

			if (status != 1) {
				return next(apiError.internal('Ошибка'));
			}

			return res.json({ message: 'Успешно' });
		} catch (error) {
			return next(apiError.internal(error));
		}
	}
}

module.exports = new productController();
