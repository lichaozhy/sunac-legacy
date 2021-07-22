const { DataTypes } = require('sequelize');
const TYPE_SHA_ID = DataTypes.CHAR(64);

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function Image(sequelize, namespace) {
	sequelize.define('Image', {
		id: { type: TYPE_SHA_ID, primaryKey: true },
		size: DataTypes.INTEGER,
		createdAt: DataTypes.DATE,
	}, {
		tableName: `${namespace}image`
	});
}

module.exports = {
	Image
};
