const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function WechatOpenid(sequelize, namespace) {
	sequelize.define('WechatOpenid', {
		openid: { type: DataTypes.CHAR(64), primaryKey: true },
		nickname: DataTypes.STRING,
		sex: DataTypes.TINYINT,
		province: DataTypes.STRING,
		city: DataTypes.STRING,
		country: DataTypes.STRING,
		headimgurl: DataTypes.STRING(512)
	}, {
		tableName: `${namespace}wechat_openid`
	});
}

module.exports = {
	WechatOpenid
};
