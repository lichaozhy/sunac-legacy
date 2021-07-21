const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function WechatOpenid(sequelize, namespace) {
	sequelize.define('WechatOpenid', {
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
	WechatOpenid
};
