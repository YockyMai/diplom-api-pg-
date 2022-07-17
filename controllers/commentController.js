const apiError = require('../error/apiError');
const { Comment, User, Rating } = require('../models/models');

class CommentController {
	async create(req, res, next) {
		try {
			const { value, productId, rating } = req.body;

			const createdComment = await Comment.create(
				{
					value,
					userId: req.user.id,
					productId,
				},
				{
					include: [
						{ model: User, attributes: { exclude: ['password'] } },
					],
				},
			);

			const comment = await Comment.findOne({
				where: {
					id: createdComment.id,
				},
				include: [
					{ model: User, attributes: { exclude: ['password'] } },
				],
			});

			return res.json(comment);
		} catch (error) {
			next(apiError.badRequest(error.message));
		}
	}

	async getAll(req, res, next) {
		try {
			let { productId } = req.params;

			console.log(productId);

			const comments = await Comment.findAll({
				where: {
					productId,
				},
				include: [
					{ model: User, attributes: { exclude: ['password'] } },
				],
			});

			return res.json(comments);
		} catch (error) {
			next(apiError.badRequest(error.message));
		}
	}

	async getCommentStars(req, res, next) {
		try {
			const { productId, userId } = req.params;

			const stars = await Rating.findOne({
				where: { productId, userId },
			});

			return res.json(stars);
		} catch (error) {
			next(apiError.badRequest(error.message));
		}
	}
}

module.exports = new CommentController();
