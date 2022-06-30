const apiError = require('../error/apiError');

class userController {
	async registration(req, res) {}

	async login(req, res) {}

	async check(req, res, next) {
		const { id } = req.query;

		if (!id) {
			return next(apiError.badRequest('ID not recognized'));
		}

		res.json(id);
	}
}

module.exports = new userController();
