const { Sequelize } = require('sequelize');
const { FK } = require('./utils');
const normalize = require('./normalize');

const User = require('./define/User');
const Content = require('./define/Content');
const Wechat = require('./define/Wechat');

const ModelFactory = {
	Administrator: User.Administrator,
	Maintainer: User.Maintainer,
	Customer: User.Customer,

	Content: Content.Content,
	Reference: Content.Reference,
	Topic: Content.Topic,
	Share: Content.Share,
	Comment: Content.Comment,
	Photo: Content.Photo,
	Post: Content.Post,

	WechatOpenid: Wechat.WechatOpenid
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
		// AccountData: sequelize.model('AccountData'),
		// AccountProductData: sequelize.model('AccountProductData'),
	};

	// Model.File.belongsTo(Model.Manager, FK('managerId'));
	// Model.Manager.hasMany(Model.File, FK('managerId'));
	// Model.File.belongsTo(Model.Plan, FK('planId'));

	return { sequelize, Model };
};
