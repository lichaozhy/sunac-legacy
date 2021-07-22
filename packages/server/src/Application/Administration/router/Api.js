const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function SunacLegacyApi(router, {
	product, AccessControl: $ac
}) {
	router
		.get('/meta', function getMeta(ctx) {
			ctx.body = product;
		})
		.get('/images/:imageId', $ac('signed'), async function getImage(ctx) {

		});
});
