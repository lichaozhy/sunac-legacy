const { DataTypes } = require('sequelize');
const TYPE_SHA_ID = DataTypes.CHAR(64);

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
function PrizeTopic(sequelize, namespace) {
	sequelize.define('PrizeTopic', {
		id: { type: TYPE_SHA_ID, primaryKey: true },
		topic: TYPE_SHA_ID,
		createdAt: DataTypes.DATE,
		deletedAt: DataTypes.DATE
	}, {
		tableName: `${namespace}activity_prize_topic`
	});
}

module.exports = {
	PrizeTopic
};
