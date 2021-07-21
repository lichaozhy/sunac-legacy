const { Router } = require('@produck/duck-web-koa-router');
const { Principal } = require('./resource');

module.exports = Router(function SunacLegacyMaintenanceCity(router, {
	Utils, Model, AccessControl: $ac
}) {
	router
		.post('/', $ac('principal.authenticate'), async function signin(ctx) {
			const { username, password } = ctx.request.body;

			const maintainer = await Model.Maintainer.findOne({
				where: { name: username },
				include: [{ model: Model.MaintainerCredential, as: 'credential' }]
			});

			if (!maintainer) {
				return ctx.throw(401, 'Illegal user');
			}

			const { credential } = maintainer;

			if (credential.password !== Utils.encodeSHA256(`${password}${credential.salt}`)) {
				return ctx.throw(401, 'Invalid credential');
			}

			ctx.session.maintainerId = maintainer.id;
			ctx.body = Principal(maintainer);
		})
		.delete('/', async function signout(ctx) {
			ctx.session = null;
			ctx.body = Principal();
		});
});
