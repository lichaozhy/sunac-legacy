const { Sequelize } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {string[]} cityList
 */
module.exports = function ShareLikeCache(sequelize, cityList) {
	const Model = {
		Like: sequelize.model('CustomerLikeShare'),
		Share: sequelize.model('Share'),
		Customer: sequelize.model('Customer')
	};

	const cache = {
		top30: [],
		shareLikeMap: {}
	};

	return Object.freeze({
		top(number = 20) {
			return cache.top30.slice(0, number);
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
				include: [{ model: Model.Share, where: { deletedAt: null }, required: true, }],
				attributes: ['share', [Sequelize.fn('COUNT', 'share'), 'liked']],
				group: ['share'],
				order: [[Sequelize.fn('COUNT', 'share'), 'DESC']]
			});

			list.forEach(like => {
				const { share, liked } = like.toJSON();

				cache.shareLikeMap[share] = liked;
			});

			const customerRegisted = {};
			const top30 = cache.top30 = [];

			for (const shareLike of list) {
				if (top30.length < 30) {
					const customerId = shareLike.Share.createdBy;

					if (!customerRegisted[customerId]) {
						top30.push(shareLike.share);
						customerRegisted[customerId] = true;
					}
				} else {
					break;
				}
			}
		}
	});
};
