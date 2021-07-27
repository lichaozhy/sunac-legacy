const { Router } = require('@produck/duck-web-koa-router');

function Principal(data = {
	id: null,
	name: null,
	password: null
}) {
	return {
		administratorId: data.id,
		username: data.name,
		password: null
	};
}

const ADDCODE_GETTER = city => city.adcode;

function Customer(data) {
	return {
		id: data.id,
		name: data.name,
		cityAs: data.cityAs,
		wechat: {
			openid: data.wechat.openid,
			nickname: data.wechat.nickname,
			sex: data.wechat.sex,
			headimgurl: data.wechat.headimgurl
		}
	};
}

function Administrator(data) {
	return {
		id: data.id,
		name: data.name,
		createdAt: data.createdAt,
		cityList: data.cityList.map(ADDCODE_GETTER),
		customer: data.customer ? Customer(data.customer) : null
	};
}

module.exports = Router(function SunacLegacyAdministrationPrincipal(router, {
	AccessControl: $ac, Model, Utils
}) {
	router
		.post('/', $ac('principal.authenticate'), async function signin(ctx) {
			const { username, password } = ctx.request.body;

			const administrator = await Model.Administrator.findOne({
				where: { name: username, deletedAt: null },
				include: [{ model: Model.AdministratorCredential, as: 'credential' }]
			});

			if (!administrator) {
				return ctx.throw(401, 'Illegal user.');
			}

			const { credential } = administrator;

			if (credential.password !== Utils.encodeSHA256(`${password}${credential.salt}`)) {
				return ctx.throw(401, 'Invalid credential');
			}

			ctx.session.administratorId = administrator.id;
			ctx.body = Principal(administrator);
		})
		.delete('/', async function signout(ctx) {
			ctx.session = null;
			ctx.body = Principal();
		})
		.use($ac('signed'), async function fetchPrincipalAdministrator(ctx, next) {
			const { administratorId } = ctx.session;

			const administrator = await Model.Administrator.findOne({
				where: { id: administratorId, deletedAt: null },
				include: [
					{ model: Model.AdministratorCity, as: 'cityList' },
					{ model: Model.AdministratorCredential, as: 'credential', required: true },
					{
						model: Model.Customer,
						as: 'customer',
						include: [
							{ model: Model.WechatOpenid, as: 'wechat', required: true },
						]
					},
				]
			});

			if (!administrator) {
				ctx.session = null;

				return ctx.throw(403);
			}

			ctx.state.principal = { administrator };

			return next();
		})
		.get('/administrator', async function getAdministrator(ctx) {
			ctx.body = Administrator(ctx.state.principal.administrator);
		})
		.put('/administrator', async function updateAdministrator(ctx) {
			const { credential } = ctx.request.body;
			const { password, _password } = credential;
			const { administrator } = ctx.state.principal;

			if (Utils.encodeSHA256(`${_password}${administrator.credential.salt}`) !==
				administrator.credential.password) {

				return ctx.throw(400, 'Incorrect original password');
			}

			const salt = Utils.salt();

			administrator.credential.salt = salt;
			administrator.credential.password = Utils.encodeSHA256(`${password}${salt}`);
			await administrator.credential.save();
			ctx.body = Administrator(administrator);
		})
		.put('/administrator/customer', async function assignCustomer(ctx) {
			let { id, cityAs } = ctx.request.body;
			const { administrator } = ctx.state.principal;

			if (administrator.customer) {
				id = id ? id : administrator.customer.id;
			}

			const customer = await Model.Customer.findOne({
				where: { id },
				include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }]
			});

			if (!customer) {
				return ctx.throw(400, 'Invalid customer.');
			}

			administrator.customerId = id;
			await administrator.save();

			if (cityAs) {
				customer.cityAs = cityAs;
				await customer.save();
			}

			ctx.body = Customer(customer);
		});
});
