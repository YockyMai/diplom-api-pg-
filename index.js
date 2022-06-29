const express = require('express');
require('dotenv').config();
const sequelize = require('./db');
const models = require('./models/models');

const PORT = process.env.PORT | 3000;

const app = express();

const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync(); // Сверяет схемы в pg и sequelize
		console.log('Connection has been established successfully.');
		app.listen(PORT, () => {
			console.log(`SERVER STARTED ON ${PORT} PORT`);
		});
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};

start();
