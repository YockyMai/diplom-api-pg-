const sequelize = require('../db');
const { DataTypes } = require('Sequelize');

const User = sequelize.define('user', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	email: { type: DataTypes.STRING, allowNull: false, unique: true },
	password: { type: DataTypes.STRING, allowNull: false },
	username: { type: DataTypes.STRING, allowNull: false },
	role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

const Basket = sequelize.define('basket', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketProduct = sequelize.define('basket_product', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Product = sequelize.define('product', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, allowNull: false, unique: true },
	price: { type: DataTypes.INTEGER, allowNull: false },
	raiting: { type: DataTypes.REAL, defaultValue: 0 },
	img: { type: DataTypes.STRING },
});

const ProductInfo = sequelize.define('product_info', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING, allowNull: false },
	description: { type: DataTypes.STRING, allowNull: false },
});

const Type = sequelize.define('type', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: false, allowNull: false },
});

const Brand = sequelize.define('brand', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: false, allowNull: false },
});

const Rating = sequelize.define('rating', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	rate: { type: DataTypes.REAL, allowNull: false },
});

const TypeBrand = sequelize.define('type_brand', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Sizes = sequelize.define('sizes', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	size: { type: DataTypes.INTEGER, unique: true, allowNull: false },
});

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

Basket.hasMany(BasketProduct);
BasketProduct.belongsTo(Basket);

Type.hasMany(Product);
Product.belongsTo(Type);

Brand.hasMany(Product);
Product.belongsTo(Brand);

Product.hasMany(BasketProduct);
BasketProduct.belongsTo(Product);

Product.hasMany(ProductInfo, { as: 'info' });
Product.belongsTo(ProductInfo);

Product.hasMany(Rating);
Rating.belongsTo(Product);

Type.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type, { through: TypeBrand });

module.exports = {
	User,
	Basket,
	BasketProduct,
	Product,
	ProductInfo,
	Type,
	Brand,
	Rating,
	TypeBrand,
};
