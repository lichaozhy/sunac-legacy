const { Router } = require('@produck/duck-web-koa-router');
const Resource = require('./resource');

module.exports = Router(function SunacLegacyMaintenanceCity(router, {
	Utils, Model, AccessControl: $ac
}) {

	const include = [
		{ model: Model.MaintainerCredential, as: 'credential', required: true }
	];

	router
		.get('/', $ac('signed'), async function getMaintainerList(ctx) {
			const { name } = ctx.query;
			const where = { deletedAt: null };

			if (name) {
				where.name = name;
			}

			const list = await Model.Maintainer.findAll({ where, include });

			ctx.body = list.map(Resource.Maintainer);
		})
		.post('/', $ac('signed'), async function createMaintainer(ctx) {
			const { name, credential } = ctx.request.body;
			const { password } = credential;

			const existedMaintainer = await Model.Maintainer.findOne({
				where: { name, deletedAt: null }
			});

			if (existedMaintainer) {
				return ctx.throw(400, 'Duplicated maintainer name.');
			}

			const salt = Utils.salt();

			const maintainer = await Model.Maintainer.create({
				id: Utils.encodeSHA256(`${Date.now()}-${name}`),
				name: name,
				createdAt: new Date(),
				credential: {
					salt: salt,
					password: Utils.encodeSHA256(`${password}${salt}`)
				}
			}, {
				include: 'credential',
			});

			ctx.body = Resource.Maintainer(maintainer);
		})
		.param('maintainerId', async function fetchMaintainer(id, ctx, next) {
			const maintainer = await Model.Maintainer.findOne({
				where: { id, deletedAt: null },
				include
			});

			if (!maintainer) {
				return ctx.throw(404, `Can not find a maintainer id="${id}"`);
			}

			ctx.state.maintainer = maintainer;

			return next();
		})
		.get('/:maintainerId', $ac('signed'), async function getMaintainer(ctx) {
			ctx.body = Resource.Maintainer(ctx.state.maintainer);
		})
		.delete('/:maintainerId', $ac('signed'), async function deleteMaintainer(ctx) {
			const { maintainer } = ctx.state;

			if (maintainer.id === ctx.session.maintainerId) {
				return ctx.throw(400, 'You can not delete yourself');
			}

			maintainer.deletedAt = new Date();
			await maintainer.save();
			ctx.body = Resource.Maintainer(maintainer);
		});
});
