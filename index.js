const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');

require('dotenv').config();

const sequelize = require('./db');
const models = require('./models/models');
const router = require('./routes');
const errorHandler = require('./middleware/errorHandlingMiddleware');

const PORT = process.env.PORT | 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

app.use(errorHandler);

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
