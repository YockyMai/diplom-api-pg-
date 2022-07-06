const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const apiError = require('../error/apiError');
const { User, Basket } = require('../models/models');

const generateJwt = (id, email, role, username) => {
	return jwt.sign(
		{
			id,
			email,
			role,
			username,
		},
		process.env.JWT_SECRET_KEY,
		{ expiresIn: '24h' },
	);
};

const decodeJwt = () => {};

class userController {
	async registration(req, res, next) {
		try {
			const { email, password, role, username } = req.body;

			if (!email || !password || !username) {
				return next(apiError.badRequest('Неверный логин или пароль'));
			}

			const candidate = await User.findOne({ where: { email } });

			if (candidate) {
				return next(
					apiError.badRequest(
						'Пользователь с таким email уже существует!',
					),
				);
			}

			let hashPassowrd = bcrypt.hashSync(password, 5);

			const user = await User.create({
				email,
				role,
				username,
				password: hashPassowrd,
			});
			const basket = Basket.create({ userId: user.id });

			const token = generateJwt(
				user.id,
				user.email,
				user.role,
				user.username,
			);

			return res.json({
				token,
			});
		} catch (error) {
			next(apiError.badRequest(error.message));
		}
	}

	async login(req, res, next) {
		const { email, password } = req.body;

		const user = await User.findOne({ where: { email } });
		if (!user) {
			return next(apiError.internal('Неверный email или пароль'));
		}

		let comparePassword = bcrypt.compareSync(password, user.password);
		if (!comparePassword) {
			return next(apiError.internal('Неверный email или пароль'));
		}

		const token = generateJwt(
			user.id,
			user.email,
			user.role,
			user.username,
		);

		return res.json({ token });
	}

	async check(req, res, next) {
		const token = generateJwt(
			req.user.id,
			req.user.email,
			req.user.role,
			req.user.username,
		);

		return res.json(token);
	}
}

module.exports = new userController();
