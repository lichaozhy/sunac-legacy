const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function SunacLegacyAdministrationPrincipal(router, {
	AccessControl: $ac
}) {
	router
		.post('/', $ac('principal.authenticate'), async function signin(ctx) {
			const { username, password } = ctx.body;

		})
		.delete('/', $ac('signed'), async function signout(ctx) {
			const { administratorId } = ctx.session;

			ctx.session.administratorId = null;
			ctx.body = { administratorId };
		})
		.get('/administrator', $ac('signed'), async function getAdministrator(ctx) {
			const { administratorId } = ctx.session;

			ctx.body = null;
		})
		.put('/administrator', $ac('signed'), async function updateAdministrator(ctx) {
			const {} = ctx.body;

		})
		.put('/administrator/certification', $ac('signed') , async function updateAdministratorCertifiaction(ctx) {

		});
});
