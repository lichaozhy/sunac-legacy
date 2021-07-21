const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function SunacLegacyMaintenanceApi(router, {
	product
}) {
	router
		.get('/meta', function getMeta(ctx) {
			ctx.body = product;
		});
});
