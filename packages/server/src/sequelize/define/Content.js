const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Content(sequelize, namespace) {
	sequelize.define('Content', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		name: DataTypes.STRING,
		gender: DataTypes.TINYINT,
		mobilePhone: DataTypes.CHAR(16),
		identificationCode: DataTypes.CHAR(18)
	}, {
		tableName: `${namespace}customer`
	});
};

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Post(sequelize, namespace) {
	sequelize.define('Content', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		name: DataTypes.STRING,
		gender: DataTypes.TINYINT,
		mobilePhone: DataTypes.CHAR(16),
		identificationCode: DataTypes.CHAR(18)
	}, {
		tableName: `${namespace}customer`
	});
};

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Comment(sequelize, namespace) {
	sequelize.define('Content', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		name: DataTypes.STRING,
		gender: DataTypes.TINYINT,
		mobilePhone: DataTypes.CHAR(16),
		identificationCode: DataTypes.CHAR(18)
	}, {
		tableName: `${namespace}customer`
	});
};

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Share(sequelize, namespace) {
	sequelize.define('Content', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		name: DataTypes.STRING,
		gender: DataTypes.TINYINT,
		mobilePhone: DataTypes.CHAR(16),
		identificationCode: DataTypes.CHAR(18)
	}, {
		tableName: `${namespace}customer`
	});
};

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Reference(sequelize, namespace) {
	sequelize.define('Content', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		name: DataTypes.STRING,
		gender: DataTypes.TINYINT,
		mobilePhone: DataTypes.CHAR(16),
		identificationCode: DataTypes.CHAR(18)
	}, {
		tableName: `${namespace}customer`
	});
};

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Topic(sequelize, namespace) {
	sequelize.define('Content', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		name: DataTypes.STRING,
		gender: DataTypes.TINYINT,
		mobilePhone: DataTypes.CHAR(16),
		identificationCode: DataTypes.CHAR(18)
	}, {
		tableName: `${namespace}customer`
	});
};

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Photo(sequelize, namespace) {
	sequelize.define('Content', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		name: DataTypes.STRING,
		gender: DataTypes.TINYINT,
		mobilePhone: DataTypes.CHAR(16),
		identificationCode: DataTypes.CHAR(18)
	}, {
		tableName: `${namespace}customer`
	});
};

module.exports = {
	Content,
	Reference,
	Topic,
	Share,
	Comment,
	Photo,
	Post
};
