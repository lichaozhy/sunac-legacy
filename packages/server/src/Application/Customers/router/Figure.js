const { Router } = require('@produck/duck-web-koa-router');

function Figure(data) {
	return {
		id: data.id,
		name: data.name,
		profile: data.profile,
		image: data.image,
		href: data.href,
		createdAt: data.createdAt,
	};
}

module.exports = Router(function SunacLegacyCustomersFigure(router, {
	Model, AccessControl: $ac
}) {
	router
		.get('/', $ac('signed'), async function getFigureList(ctx) {
			const list = await Model.Figure.findAll({ where: { deletedAt: null } });

			ctx.body = list.map(Figure);
		})
		.get('/:figureId/file', async function getFigureFile(ctx) {
			const figureFile = await Model.FigureFile.findOne({
				where: { figureId: ctx.params.figureId }
			});

			ctx.type = 'json';
			ctx.body = figureFile.body;
		});
});
