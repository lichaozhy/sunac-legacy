const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function SunacLegacyAdministrationCity(router, {
	AccessControl: $ac
}) {
	router
		.get('/', $ac('signed'), async function getAllCity(ctx) {

		});
});
