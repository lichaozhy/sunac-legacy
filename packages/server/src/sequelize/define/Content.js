const { DataTypes } = require('sequelize');
const TYPE_SHA_ID = DataTypes.CHAR(64);

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Content(sequelize, namespace) {
	sequelize.define('Content', {
		id: { type: TYPE_SHA_ID, primaryKey: true },

		like: DataTypes.INTEGER,

		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
		deletedAt: DataTypes.DATE,
		validatedAt: DataTypes.DATE,

		validatedBy: TYPE_SHA_ID, // An administrator
		createdBy: TYPE_SHA_ID // A customer
	}, {
		tableName: `${namespace}content`
	});
}

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Share(sequelize, namespace) {
	sequelize.define('Share', {
		contentId: { type: TYPE_SHA_ID, primaryKey: true },
		raw: DataTypes.TEXT,
		cityAs: DataTypes.CHAR(6)
	}, {
		tableName: `${namespace}content_share`
	});

	sequelize.define('ShareImage', {
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		shareId: TYPE_SHA_ID,
		imageId: TYPE_SHA_ID
	}, {
		tableName: `${namespace}content_share_image`
	});
}

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Reference(sequelize, namespace) {
	sequelize.define('Reference', {
		contentId: { type: TYPE_SHA_ID, primaryKey: true },
		title: DataTypes.STRING,
		abstract: DataTypes.TEXT,
		thumb: TYPE_SHA_ID,
		href: DataTypes.STRING(512),
		read: DataTypes.INTEGER,
		cityAs: DataTypes.CHAR(6)
	}, {
		tableName: `${namespace}content_reference`
	});

	sequelize.define('ReferenceComment', {
		contentId: { type: TYPE_SHA_ID, primaryKey: true },
		referenceId: TYPE_SHA_ID,
		raw: DataTypes.TEXT
	}, {
		tableName: `${namespace}content_reference_comment`
	});
}

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Topic(sequelize, namespace) {
	sequelize.define('Topic', {
		contentId: { type: TYPE_SHA_ID, primaryKey: true },
		title: DataTypes.STRING,
		banner: TYPE_SHA_ID,
		description: DataTypes.STRING,
		read: DataTypes.INTEGER,
		cityAs: DataTypes.CHAR(6)
	}, {
		tableName: `${namespace}content_topic`
	});

	sequelize.define('TopicPost', {
		contentId: { type: TYPE_SHA_ID, primaryKey: true },
		topicId: TYPE_SHA_ID,
		raw: DataTypes.STRING
	}, {
		tableName: `${namespace}content_topic_post`
	});

	sequelize.define('TopicPostImage', {
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		topicPostId: TYPE_SHA_ID,
		imageId: TYPE_SHA_ID
	}, {
		tableName: `${namespace}content_topic_post_image`
	});
}

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Photo(sequelize, namespace) {
	sequelize.define('Photo', {
		contentId: { type: TYPE_SHA_ID, primaryKey: true },
		title: DataTypes.STRING(64),
		imageId: TYPE_SHA_ID,
		cityAs: DataTypes.CHAR(6)
	}, {
		tableName: `${namespace}content_photo`
	});
}

module.exports = {
	Content, // 抽象类内容

	Reference, // 外部引用的文章
	Topic, // 话题
	Share, // 朋友圈
	Photo, // 活动照片
};
