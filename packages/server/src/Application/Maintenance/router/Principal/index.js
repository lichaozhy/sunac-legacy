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
				where: { name: username, deletedAt: null },
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
		.use(async function fetchPrincipalMaintainer(ctx, next) {
			const maintainer = await Model.Maintainer.findOne({
				where: { id: ctx.session.maintainerId },
				include: [{ model: Model.MaintainerCredential, as: 'credential' }]
			});

			if (!maintainer) {
				ctx.session = null;

				return ctx.throw(403);
			}

			ctx.state.principal = { maintainer };

			return next();
		})
		.get('/maintainer', $ac('signed'), async function getMaintainerOfPrincipal(ctx) {
			ctx.body = Maintainer(ctx.state.principal.maintainer);
		})
		.put('/maintainer', $ac('signed'), async function updateMaintainer(ctx) {
			const { credential } = ctx.request.body;
			const { password, _password } = credential;
			const { maintainer } = ctx.state.principal;

			if (Utils.encodeSHA256(`${_password}${maintainer.credential.salt}`) !==
				maintainer.credential.password) {

				return ctx.throw(400, 'Incorrect original password');
			}

			const salt = Utils.salt();

			maintainer.credential.salt = salt;
			maintainer.credential.password = Utils.encodeSHA256(`${password}${salt}`);
			await maintainer.credential.save();
			ctx.body = Maintainer(maintainer);
		});
});
