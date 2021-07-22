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
		name: DataTypes.STRING(32)
	}, {
		tableName: `${namespace}customer`
	});
}

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Administrator(sequelize, namespace) {
	sequelize.define('Administrator', {
		id: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		name: DataTypes.STRING(32),
		createdAt: DataTypes.DATE,
		deletedAt: DataTypes.DATE
	}, {
		tableName: `${namespace}administrator`
	});
}

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function AdministratorCity(sequelize, namespace) {
	sequelize.define('AdministratorCity', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		administratorId: DataTypes.CHAR(64),
		adcode: DataTypes.CHAR(6)
	}, {
		tableName: `${namespace}administrator_city`
	});
}

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function AdministratorCredential(sequelize, namespace) {
	sequelize.define('AdministratorCredential', {
		administratorId: {
			type: DataTypes.CHAR(64),
			primaryKey: true
		},
		salt: DataTypes.CHAR(8),
		password: DataTypes.CHAR(64)
	}, {
		tableName: `${namespace}administrator_credential`
	});
}

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
		createdAt: DataTypes.DATE,
		deletedAt: DataTypes.DATE
	}, {
		tableName: `${namespace}maintainer`
	});
}

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
	AdministratorCredential,
	AdministratorCity,

	Maintainer,
	MaintainerCredential
};
