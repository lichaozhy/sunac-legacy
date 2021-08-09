const { Sequelize } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {string[]} cityList
 */
module.exports = function ShareLikeCache(sequelize, cityList) {
	const Model = {
		Like: sequelize.model('CustomerLikeShare'),
		Share: sequelize.model('Share'),
	};

	const cache = {
		top30OfCityMap: {},
		shareLikeMap: {}
	};

	return Object.freeze({
		top(adcode, number = 20) {
			return cache.top30OfCityMap[adcode].slice(0, number);
		},
		commit(shareId) {
			if (!cache.shareLikeMap[shareId]) {
				cache.shareLikeMap[shareId] = 0;
			}

			return ++cache.shareLikeMap[shareId];
		},
		revert(shareId) {
			return --cache.shareLikeMap[shareId];
		},
		get(shareId) {
			const count = cache.shareLikeMap[shareId];

			return count === undefined ? 0 : count;
		},
		async compute() {
			const list = await Model.Like.findAll({
				include: [{ model: Model.Share, where: { deletedAt: null }, required: true}],
				attributes: ['share', [Sequelize.fn('COUNT', 'share'), 'liked']],
				group: ['share'],
				order: [[Sequelize.fn('COUNT', 'share'), 'DESC']]
			});

			for (const adcode of cityList) {
				const list = await await Model.Like.findAll({
					attributes: ['share', [Sequelize.fn('COUNT', 'share'), 'liked']],
					include: [{ model: Model.Share, where: { city: adcode, deletedAt: null }, required: true }],
					group: ['share'],
					order: [[Sequelize.fn('COUNT', 'share'), 'DESC']],
					offset: 0,
					limit: 30
				});

				cache.top30OfCityMap[adcode] = list.map(like => like.share);
			}

			list.forEach(like => {
				const { share, liked } = like.toJSON();

				cache.shareLikeMap[share] = liked;
			});
		}
	});
};
