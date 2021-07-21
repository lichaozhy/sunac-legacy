const { Router } = require('@produck/duck-web-koa-router');
const Resource = require('./resource');
const { Maintainer } = require('../Maintainer/resource');

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
			ctx.body = Resource.Principal(maintainer);
		})
		.delete('/', async function signout(ctx) {
			ctx.session = null;
			ctx.body = Resource.Principal();
		})
		.get('/maintainer', $ac('signed'), async function getMaintainerOfPrincipal(ctx) {
			const maintainer = await Model.Maintainer.findOne({
				where: { id: ctx.session.maintainerId },
				include: [{ model: Model.MaintainerCredential, as: 'credential' }]
			});

			ctx.body = Maintainer(maintainer);
		});
});
