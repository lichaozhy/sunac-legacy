const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Customer(sequelize, namespace) {
	sequelize.define('Customer', {
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
function Administrator(sequelize, namespace) {
	sequelize.define('Administrator', {
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
function Maintainer(sequelize, namespace) {
	sequelize.define('Maintainer', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		name: DataTypes.STRING(32),
		createdAt: DataTypes.DATE
	}, {
		tableName: `${namespace}maintainer`
	});
};

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function MaintainerCredential(sequelize, namespace) {
	sequelize.define('MaintainerCredential', {
		maintainerId: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		salt: DataTypes.CHAR(8),
		password: DataTypes.CHAR(64)
	}, {
		tableName: `${namespace}maintainer_credential`
	});
}

module.exports = {
	Customer,
	Administrator,
	Maintainer,
	MaintainerCredential
};
