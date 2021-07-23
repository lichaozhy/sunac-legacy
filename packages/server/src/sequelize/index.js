const { Sequelize } = require('sequelize');
const { FK } = require('./utils');
const normalize = require('./normalize');

const User = require('./define/User');
const Content = require('./define/Content');
const Image = require('./define/Image');
const Wechat = require('./define/Wechat');

const ModelFactory = {
	Maintainer: User.Maintainer,
	MaintainerCredential: User.MaintainerCredential,

	Administrator: User.Administrator,
	AdministratorCredential: User.AdministratorCredential,
	AdministratorCity: User.AdministratorCity,

	Customer: User.Customer,
	WechatOpenid: Wechat.WechatOpenid,

	Content: Content.Content,
	Reference: Content.Reference,
	Topic: Content.Topic,
	Share: Content.Share,
	Photo: Content.Photo,

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

		Content: sequelize.model('Content'),

		Share: sequelize.model('Share'),
		ShareImage: sequelize.model('ShareImage'),

		Reference: sequelize.model('Reference'),
		ReferenceComment: sequelize.model('ReferenceComment'),

		Topic: sequelize.model('Topic'),
		TopicPost: sequelize.model('TopicPost'),
		TopicPostImage: sequelize.model('TopicPostImage'),

		Photo: sequelize.model('Photo'),

		Image: sequelize.model('Image')
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

	Model.Customer.belongsTo(Model.WechatOpenid, FK('wechatOpenid'));
	Model.Administrator.belongsTo(Model.Customer, FK('customerId', { as: 'customer' }));
	Model.Customer.hasOne(Model.Administrator, FK('customerId', { as: 'customer' }));

	/**
	 * About content
	 */
	const contentFk = FK('contentId', { as: 'content' });

	Model.Share.belongsTo(Model.Content, contentFk);
	Model.Reference.belongsTo(Model.Content, contentFk);
	Model.ReferenceComment.belongsTo(Model.Content, contentFk);
	Model.Topic.belongsTo(Model.Content, contentFk);
	Model.TopicPost.belongsTo(Model.Content, contentFk);
	Model.Photo.belongsTo(Model.Content, contentFk);

	Model.Share.hasMany(Model.ShareImage, FK('shareId', { as: 'imageList' }));
	Model.TopicPost.hasMany(Model.TopicPostImage, FK('topicPostId', { as: 'imageList' }));

	Model.ShareImage.belongsTo(Model.Image, FK('imageId'));
	Model.Reference.belongsTo(Model.Image, FK('thumb'));
	Model.Topic.belongsTo(Model.Image, FK('banner'));
	Model.TopicPostImage.belongsTo(Model.Image, FK('imageId'));
	Model.Photo.belongsTo(Model.Image, FK('imageId'));

	return { sequelize, Model };
};
