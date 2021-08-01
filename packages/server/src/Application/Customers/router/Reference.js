const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function SunacLegacyApi(router, {
	Model
}) {
	function Reference(data) {
		return {
			id: data.id,
			title: data.title,
			abstract: data.abstract,
			thumb: data.thumb,
			href: data.href,
			read: data.read,
			city: data.city,
			createdAt: data.createdAt
		};
	}

	router
		.get('/', async function getReferenceList(ctx) {
			const { from = 0, size = 20 } = ctx.query;
			const { customer } = ctx.state;

			const { rows, count } = await Model.Reference.findAndCountAll({
				where: { city: customer.cityAs, deletedAt: null },
				offset: from,
				limit: size,
				order: [['createdAt', 'DESC']]
			});

			ctx.body = {
				list: rows.map(Reference),
				total: count
			};
		});
});
