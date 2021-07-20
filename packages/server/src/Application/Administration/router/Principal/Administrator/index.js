const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function SunacLegacyAdministrationPrincipal(router, {
	AccessControl: $ac
}) {
	router
		.get('/', $ac('signed'), async function getAdministrator(ctx) {
			const { administratorId } = ctx.session;

			ctx.body = null;
		})
		.put('/', $ac('signed'), async function updateAdministrator(ctx) {
			const {} = ctx.body;

		})
		.put('/certification', $ac('signed') , async function updateAdministratorCertifiaction(ctx) {

		});
});
