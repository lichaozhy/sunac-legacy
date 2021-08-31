const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

module.exports = Router(function SunacLegacyApi(router, {
	Model
}) {
	function News(data) {
		return {
			id: data.id,
			title: data.title,
			thumb: data.thumb,
			href: data.href,
			createdAt: data.createdAt,
			publishedAt: data.publishedAt
		};
	}

	router
		.get('/', async function getReferenceList(ctx) {
			const { from = 0, size, createdAt = new Date() } = ctx.query;

			const { rows, count } = await Model.News.findAndCountAll({
				where: {
					deletedAt: null,
					createdAt: { [Op.lt]: createdAt },
				},
				offset: Number(from),
				limit: Number(size),
				order: [['publishedAt', 'DESC']]
			});

			ctx.body = {
				list: rows.map(News),
				total: count
			};
		});
});
