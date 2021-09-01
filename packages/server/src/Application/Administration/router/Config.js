const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function SunacLegacyApi(router, {
	Config, AccessControl: $ac
}) {
	router
		.use($ac('signed'))
		.get('/:key', async function getConfigByKey(ctx) {
			ctx.body = { value: Config.get(ctx.params.key) };
		})
		.put('/:key', async function setConfigByKey(ctx) {
			const { value } = ctx.request.body;

			ctx.body = { value: Config.set(ctx.params.key, value) };
		});
});
