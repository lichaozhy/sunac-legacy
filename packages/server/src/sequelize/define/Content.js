const { DataTypes } = require('sequelize');
const TYPE_SHA_ID = DataTypes.CHAR(64);

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Share(sequelize, namespace) {
	sequelize.define('Share', {
		id: { type: TYPE_SHA_ID, primaryKey: true },
		title: DataTypes.STRING,
		raw: DataTypes.TEXT,
		city: DataTypes.CHAR(6),

		createdBy: TYPE_SHA_ID,
		validatedBy: TYPE_SHA_ID,

		createdAt: DataTypes.DATE,
		deletedAt: DataTypes.DATE,
		validatedAt: DataTypes.DATE,
	}, {
		tableName: `${namespace}content_share`
	});

	sequelize.define('ShareImage', {
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		share: TYPE_SHA_ID,
		image: TYPE_SHA_ID
	}, {
		tableName: `${namespace}content_share_image`
	});

	sequelize.define('CustomerLikeShare', {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		customer: TYPE_SHA_ID,
		share: TYPE_SHA_ID,
		createdAt: DataTypes.DATE
	}, {
		tableName: `${namespace}customer_like_share`
	});
}

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Reference(sequelize, namespace) {
	sequelize.define('Reference', {
		id: { type: TYPE_SHA_ID, primaryKey: true },
		title: DataTypes.STRING,
		abstract: DataTypes.TEXT,
		thumb: TYPE_SHA_ID,
		href: DataTypes.STRING(512),
		read: DataTypes.INTEGER,
		city: DataTypes.CHAR(6),
		createdAt: DataTypes.DATE,
		deletedAt: DataTypes.DATE,
	}, {
		tableName: `${namespace}content_reference`
	});
}

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Topic(sequelize, namespace) {
	sequelize.define('Topic', {
		id: { type: TYPE_SHA_ID, primaryKey: true },
		title: DataTypes.STRING,
		banner: TYPE_SHA_ID,
		description: DataTypes.STRING,
		city: DataTypes.CHAR(6),
		read: DataTypes.INTEGER,
		like: DataTypes.INTEGER,

		createdBy: TYPE_SHA_ID,
		validatedBy: TYPE_SHA_ID,

		validatedAt: DataTypes.DATE,
		createdAt: DataTypes.DATE,
		deletedAt: DataTypes.DATE,
	}, {
		tableName: `${namespace}content_topic`
	});

	sequelize.define('Post', {
		id: { type: TYPE_SHA_ID, primaryKey: true },
		topic: TYPE_SHA_ID,
		raw: DataTypes.STRING,
		like: DataTypes.INTEGER,

		createdBy: TYPE_SHA_ID,
		validatedBy: TYPE_SHA_ID,

		validatedAt: DataTypes.DATE,
		createdAt: DataTypes.DATE,
		deletedAt: DataTypes.DATE,
	}, {
		tableName: `${namespace}content_topic_post`
	});

	sequelize.define('PostImage', {
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		post: TYPE_SHA_ID,
		image: TYPE_SHA_ID
	}, {
		tableName: `${namespace}content_topic_post_image`
	});

	sequelize.define('Reply', {
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		post: TYPE_SHA_ID,
		raw: DataTypes.STRING,
		createdAt: DataTypes.DATE,
		createdBy: TYPE_SHA_ID,
		validatedAt: DataTypes.DATE,
		validatedBy: TYPE_SHA_ID,
		deletedAt: DataTypes.DATE,
	}, {
		tableName: `${namespace}content_topic_post_reply`
	});
}

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Photo(sequelize, namespace) {
	sequelize.define('Photo', {
		id: { type: TYPE_SHA_ID, primaryKey: true },
		title: DataTypes.STRING(64),
		image: TYPE_SHA_ID,
		like: DataTypes.INTEGER,
		city: DataTypes.CHAR(6),
		createdAt: DataTypes.DATE,
		deletedAt: DataTypes.DATE,
	}, {
		tableName: `${namespace}content_photo`
	});
}

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Figure(sequelize, namespace) {
	sequelize.define('Figure', {
		id: { type: TYPE_SHA_ID, primaryKey: true },
		image: TYPE_SHA_ID,
		name: DataTypes.CHAR(6),
		profile: DataTypes.STRING,
		href: DataTypes.STRING,
		city: DataTypes.CHAR(6),
		createdAt: DataTypes.DATE,
		deletedAt: DataTypes.DATE,
	}, {
		tableName: `${namespace}content_figure`
	});
}

module.exports = {
	Reference, // 外部引用的文章
	Topic, // 话题
	Share, // 朋友圈
	Photo, // 活动照片
	Figure
};
