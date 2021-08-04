const { Sequelize } = require('sequelize');
const { FK } = require('./utils');
const normalize = require('./normalize');

const User = require('./define/User');
const Content = require('./define/Content');
const Image = require('./define/Image');
const Wechat = require('./define/Wechat');
const Activity = require('./define/Activity');

const ModelFactory = {
	Maintainer: User.Maintainer,
	MaintainerCredential: User.MaintainerCredential,

	Administrator: User.Administrator,
	AdministratorCredential: User.AdministratorCredential,
	AdministratorCity: User.AdministratorCity,

	Customer: User.Customer,
	WechatOpenid: Wechat.WechatOpenid,

	Reference: Content.Reference,
	Topic: Content.Topic,
	Share: Content.Share,
	Photo: Content.Photo,
	Banner: Content.Banner,

	PrizeTopic: Activity.PrizeTopic,

	Image: Image.Image
};

module.exports = function SunacLegacySequelize(options) {
	const finalOptions = normalize(options);

	const sequelize = new Sequelize({
		dialect: 'sqlite',
		storage: finalOptions.storage,
		define: {
			underscored: true,
			timestamps: false,
			freezeTableName: true
		},
		logging: finalOptions.onLog
	});

	for(const name in ModelFactory) {
		ModelFactory[name](sequelize, finalOptions.namespace);
	}

	/**
	 * Associations
	 */
	const Model = {
		Maintainer: sequelize.model('Maintainer'),
		MaintainerCredential: sequelize.model('MaintainerCredential'),

		Administrator: sequelize.model('Administrator'),
		AdministratorCredential: sequelize.model('AdministratorCredential'),
		AdministratorCity: sequelize.model('AdministratorCity'),

		Customer: sequelize.model('Customer'),
		WechatOpenid: sequelize.model('WechatOpenid'),

		Share: sequelize.model('Share'),
		ShareImage: sequelize.model('ShareImage'),
		CustomerLikeShare: sequelize.model('CustomerLikeShare'),

		Reference: sequelize.model('Reference'),

		Topic: sequelize.model('Topic'),
		Post: sequelize.model('Post'),
		PostImage: sequelize.model('PostImage'),

		Photo: sequelize.model('Photo'),
		Banner: sequelize.model('Banner'),

		Image: sequelize.model('Image'),

		PrizeTopic: sequelize.model('PrizeTopic')
	};

	/**
	 * About user
	 */
	const maintainerWithCredential = FK('maintainerId', { as: 'credential' });

	Model.MaintainerCredential.belongsTo(Model.Maintainer, maintainerWithCredential);
	Model.Maintainer.hasOne(Model.MaintainerCredential, maintainerWithCredential);

	const administratorWithCredential = FK('administratorId', { as: 'credential' });

	Model.AdministratorCredential.belongsTo(Model.Administrator, administratorWithCredential);
	Model.Administrator.hasOne(Model.AdministratorCredential, administratorWithCredential);

	const administratorManagedCity = FK('administratorId', { as: 'cityList' });

	Model.Administrator.hasMany(Model.AdministratorCity, administratorManagedCity);

	const customerWithWechat = FK('customerId', { as: 'wechat' });

	Model.Customer.hasOne(Model.WechatOpenid, customerWithWechat);
	Model.WechatOpenid.belongsTo(Model.Customer, customerWithWechat);

	Model.Administrator.belongsTo(Model.Customer, FK('customerId', { as: 'customer' }));
	Model.Customer.hasOne(Model.Administrator, FK('customerId', { as: 'customer' }));

	/**
	 * About content
	 */
	Model.Share.belongsTo(Model.Customer, FK('createdBy'));
	Model.Topic.belongsTo(Model.Customer, FK('createdBy'));
	Model.Post.belongsTo(Model.Customer, FK('createdBy'));

	Model.Share.hasMany(Model.ShareImage, FK('share', { as: 'imageList' }));
	Model.Post.hasMany(Model.PostImage, FK('post', { as: 'imageList' }));

	Model.ShareImage.belongsTo(Model.Image, FK('image'));
	Model.ShareImage.belongsTo(Model.Share, FK('share'));
	Model.Reference.belongsTo(Model.Image, FK('thumb'));
	Model.Topic.belongsTo(Model.Image, FK('banner'));
	Model.PostImage.belongsTo(Model.Image, FK('image'));
	Model.Photo.belongsTo(Model.Image, FK('image'));
	Model.Banner.belongsTo(Model.Image, FK('image'));

	Model.CustomerLikeShare.belongsTo(Model.Share, FK('share'));

	/**
	 * Activity
	 */
	Model.PrizeTopic.belongsTo(Model.Topic, FK('topic'));
	Model.Topic.hasOne(Model.PrizeTopic, FK('topic'));

	return { sequelize, Model };
};
