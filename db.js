const { Sequelize } = require('sequelize');

module.exports = new Sequelize(process.env.DB_URL, {
	dialect: 'postgres',
	dialectOptions: {
		require: true,
		rejectUnauthorized: false,
		ssl: true,
		native: true,
	},
});
