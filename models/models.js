const sequelize = require('../db');
const { DataTypes } = require('sequelize');

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
	rating: { type: DataTypes.REAL, defaultValue: 0 },
	img: { type: DataTypes.STRING },
	discountPrice: {type: DataTypes.INTEGER}
});

const ProductInfo = sequelize.define('product_info', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING, allowNull: false },
	description: { type: DataTypes.TEXT, allowNull: false },
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

const ProductSize = sequelize.define('product_size', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	count: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const Sizes = sequelize.define(
	'sizes',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		size: { type: DataTypes.INTEGER, unique: true, allowNull: false },
	},
	{
		timestamps: false,
	},
);

const Order = sequelize.define('order', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	status: { type: DataTypes.STRING, defaultValue: 'active' },
	address: {type: DataTypes.STRING }
});

const OrderProducts = sequelize.define('order_products', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Comment = sequelize.define('comment', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	value: { type: DataTypes.TEXT, require: true },
	approved: {type: DataTypes.BOOLEAN, defaultValue: false}
});

User.hasMany(Comment);
Product.hasMany(Comment);
Comment.belongsTo(User);
Comment.belongsTo(Product);

Product.hasMany(OrderProducts);
OrderProducts.belongsTo(Product);

Sizes.hasMany(OrderProducts);
OrderProducts.belongsTo(Sizes);

Order.hasMany(OrderProducts);
OrderProducts.belongsTo(Order);

User.hasMany(Order);
Order.belongsTo(User);

BasketProduct.belongsTo(Sizes);

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

Product.hasMany(ProductSize, { as: 'sizes' });

ProductSize.belongsTo(Sizes);

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
	Sizes,
	ProductSize,
	Order,
	OrderProducts,
	Comment,
};
