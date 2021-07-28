const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

function Reference(data) {
	return {
		id: data.id,
		title: data.title,
		abstract: data.abstract,
		thumb: data.thumb,
		href: data.href,
		city: data.city,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt
	};
}

function isString(any) {
	return typeof any === 'string';
}

module.exports = Router(function SunacLegacyAdministrationReference(router, {
	Model, AccessControl: $ac, Utils
}) {
	router
		.use($ac('signed'), async function getManagedCityList(ctx, next) {
			const { administratorId } = ctx.session;

			const administrator = await Model.Administrator.findOne({
				where: { id: administratorId, deletedAt: null },
				include: [
					{ model: Model.AdministratorCity, as: 'cityList' },
					{
						model: Model.Customer, as: 'customer',
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }]
					},
				]
			});

			ctx.state.cityList = administrator.cityList;
			ctx.state.customer = administrator.customer;
			ctx.state.administrator = administrator;

			return next();
		})
		.get('/', async function getAllReferenceList(ctx) {
			const { pageSize = 10000000, pageCurrent = 1, title, city: cityAdcode } = ctx.query;
			const { cityList } = ctx.state;

			const where = {
				deletedAt: null,
				city: { [Op.in]: cityList.map(city => city.adcode) }
			};

			if (cityAdcode && cityList.some(city => city.adcode === cityAdcode)) {
				where.city = cityAdcode;
			}

			if (title) {
				where.title = { [Op.like]: `%${title}%` };
			}

			const { rows, count } = await Model.Reference.findAndCountAll({
				where,
				offset: (pageCurrent - 1) * pageSize,
				limit: pageSize,
				order: [['createdAt', 'DESC']]
			});

			ctx.body = {
				list: rows.map(Reference),
				total: count,
				size: Number(pageSize),
				current: Number(pageCurrent)
			};
		})
		.post('/', async function createReference(ctx) {
			const { title, abstract, href, thumb, city } = ctx.request.body;

			if (!isString(title)) {
				return ctx.throw(400, 'Invalid ".title".');
			}

			if (!isString(abstract)) {
				return ctx.throw(400, 'Invalid ".abstract".');
			}

			if (!isString(href)) {
				return ctx.throw(400, 'Invalid ".href".');
			}

			if (!isString(city)) {
				return ctx.throw(400, 'Invalid ".city".');
			}

			if (!isString(thumb)) {
				return ctx.throw(400, 'Invalid ".thumb".');
			}

			const now = new Date();
			const reference = await Model.Reference.create({
				id: Utils.encodeSHA256(`${title}${href}${city}${now}`),
				title, abstract, href, city, thumb, read: 0,
				createdAt: now, validatedAt: now, updatedAt: now,
			});

			ctx.body = Reference(reference);
		})
		.param('referenceId', async function fetchReference(id, ctx, next) {
			const { cityList } = ctx.state;

			const reference = await Model.Reference.findOne({
				where: {
					id,
					deletedAt: null,
					city: { [Op.in]: cityList.map(city => city.adcode) }
				}
			});

			if (!reference) {
				return ctx.throw(404, `The reference id="${id}" is NOT defined.`);
			}

			ctx.state.reference = reference;

			return next();
		})
		.get('/:referenceId', async function getReference(ctx) {
			ctx.body = Reference(ctx.state.reference);
		})
		.delete('/:referenceId', async function deleteReference(ctx) {
			const { reference } = ctx.state;

			reference.deletedAt = new Date();
			await reference.save();
			ctx.body = Reference(reference);
		});
});
