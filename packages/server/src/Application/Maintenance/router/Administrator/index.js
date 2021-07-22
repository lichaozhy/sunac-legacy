const { Router } = require('@produck/duck-web-koa-router');
const Resource = require('./resource');

module.exports = Router(function SunacLegacyMaintenanceCity(router, {
	Utils, Model, AccessControl: $ac
}) {
	const ADCODE_TO_CITY = adcode => ({ adcode });

	router
		.get('/', $ac('signed'), async function getAdministratorList(ctx) {
			const list = await Model.Administrator.findAll({
				where: { deletedAt: null },
				include: [
					{ model: Model.AdministratorCredential, as: 'credential' },
					{ model: Model.AdministratorCity, as: 'cityList' }
				]
			});

			ctx.body = list.map(Resource.Administrator);
		})
		.post('/', $ac('signed'), async function createAdministrator(ctx) {
			const { name, credential, cityList } = ctx.request.body;
			const { password } = credential;
			const salt = Utils.salt();

			if (typeof name !== 'string' || name.length < 2 || name.length > 32) {
				return ctx.throw(400, 'Invalid name, MUST be a string length 2-32');
			}

			if (typeof credential !== 'object') {
				return ctx.throw(400, 'Credential required');
			}

			if (typeof password !== 'string') {
				return ctx.throw(400, 'A password MUST be a string.');
			}

			if (!Array.isArray(cityList)) {
				return ctx.throw(400, 'A cityList MUST be an array of adcode strings.');
			}

			for (const adcode of cityList) {
				if (!Utils.City.isCityAdcode(adcode)) {
					return ctx.throw(400, `Invalid city adcode ${adcode}`);
				}
			}

			const existed = await Model.Administrator.count({
				where: { name, deletedAt: null }
			});

			if (existed > 0) {
				return ctx.throw(400, 'Dumplicated administrator name');
			}

			const administrator = await Model.Administrator.create({
				id: Utils.encodeSHA256(`${Date.now()}-${name}`),
				name,
				createdAt: new Date(),
				cityList: cityList.map(ADCODE_TO_CITY),
				credential: {
					salt: salt,
					password: Utils.encodeSHA256(`${password}${salt}`)
				}
			}, {
				include: [
					{ model: Model.AdministratorCredential, as: 'credential' },
					{ model: Model.AdministratorCity, as: 'cityList' }
				]
			});

			ctx.body = Resource.Administrator(administrator);
		})
		.param('administratorId', async function fetchAdministrator(id, ctx, next) {
			const administrator = await Model.Administrator.findAll({
				where: { id, deletedAt: null },
				include: [
					{ model: Model.AdministratorCredential, as: 'credential' },
					{ model: Model.AdministratorCity, as: 'cityList' }
				]
			});

			if (!administrator) {
				return ctx.throw(404, `An administrator id="${id}" is NOT existed.`);
			}

			ctx.state.administrator = administrator;

			return next();
		})
		.get('/:administratorId', $ac('signed'), async function getAdministrator(ctx) {
			ctx.body = Resource.Administrator(ctx.state.administrator);
		})
		.delete('/:administratorId', $ac('signed'), async function deleteAdministrator(ctx) {
			const { administrator } = ctx.state;

			administrator.deletedAt = new Date();
			await administrator.save();
			ctx.body = Resource.Administrator(administrator);
		})
		.post('/:administratorId/city', async function addManagedCity(ctx) {
			const { adcode } = ctx.request.body;

			if (!Utils.City.isCityAdcode(adcode)) {
				return ctx.throw(400, 'Invalid adcode.');
			}

			const { administratorId } = ctx.params;

			const checked = await Model.AdministratorCity({
				where: { administratorId, adcode }
			});

			if (checked) {
				return ctx.throw(400, `The administrator is NOT managing city adcode ="${adcode}"`);
			}

			const { administrator } = ctx.state;

			const administratorCity = await Model.AdministratorCity.create({
				administratorId: administrator.id,
				adcode
			});

			ctx.body = Resource.AdministratorCity(administratorCity);
		})
		.param('adcode', async function fetchAdministratorCity(adcode, ctx, next) {
			if (!Utils.City.isCityAdcode(adcode)) {
				return ctx.throw(400, 'Invalid adcode.');
			}

			const { administratorId } = ctx.params;

			const administratorCity = await Model.AdministratorCity.findOne({
				where: { administratorId, adcode }
			});

			if (!administratorCity) {
				return ctx.throw(404, `The administrator is NOT managing city adcode ="${adcode}"`);
			}

			ctx.state.administratorCity = administratorCity;

			return next();
		})
		.delete('/:administratorId/city/:adcode', async function deleteManagedCity(ctx) {
			const { administratorCity } = ctx.state;

			await administratorCity.destroy();
			ctx.body = Resource.AdministratorCity(administratorCity);
		});
});
