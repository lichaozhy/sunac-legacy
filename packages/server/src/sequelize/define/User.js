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
		name: DataTypes.STRING,
		gender: DataTypes.TINYINT,
		mobilePhone: DataTypes.CHAR(16),
		identificationCode: DataTypes.CHAR(18)
	}, {
		tableName: `${namespace}customer`
	});
};

module.exports = {
	Customer,
	Administrator,
	Maintainer
};
