const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

function Reference(data) {
	return {
		id: data.id,
		title: data.reference.title,
		abstract: data.reference.abstract,
		thumb: data.reference.thumb,
		href: data.reference.href,
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

			ctx.state.cityList = await Model.AdministratorCity.findAll({
				where: { administratorId }
			});

			return next();
		})
		.get('/', async function getAllReferenceList(ctx) {
			const { pageSize = 10000000, pageCurrent = 1 } = ctx.query;
			const { cityList } = ctx.state;

			const { rows, count } = await Model.Content.findAndCountAll({
				where: { deletedAt: null },
				include: [{
					model: Model.Reference, as: 'reference', required: true,
					where: { cityAs: { [Op.in]: cityList.map(city => city.adcode) } }
				}],
				offset: (pageCurrent - 1) * pageSize,
				limit: pageSize,
				order: ['createdAt', 'DESC']
			});

			ctx.body = {
				list: rows.map(Reference),
				total: count,
				size: pageSize,
				current: pageCurrent
			};
		})
		.post('/', async function createReference(ctx) {
			const { title, abstract, href, thumb, cityAs } = ctx.request.body;
			const { id } = thumb;

			if (!isString(title)) {
				return ctx.throw(400, 'Invalid ".title".');
			}

			if (!isString(abstract)) {
				return ctx.throw(400, 'Invalid ".abstract".');
			}

			if (!isString(href)) {
				return ctx.throw(400, 'Invalid ".href".');
			}

			if (!isString(cityAs)) {
				return ctx.throw(400, 'Invalid ".cityAs".');
			}

			if (typeof thumb !== 'object') {
				return ctx.throw(400, 'Invalid ".thumb".');
			}

			if (!isString(id)) {
				return ctx.throw(400, 'Invalid ".thumb.id".');
			}

			const now = new Date();
			const reference = await Model.Content.create({
				id: Utils.encodeSHA256(`${title}${href}${cityAs}${now}`),
				createdAt: now, validatedAt: now, updatedAt: now, like: 0,
				reference: { title, abstract, href, cityAs, thumb: id, read: 0}
			}, { include: [{ model: Model.Reference, as: 'reference' }] });

			ctx.body = Reference(reference);
		})
		.param('referenceId', async function fetchReference(id, ctx, next) {
			const { cityList } = ctx.state;

			const reference = await Model.Content.findOne({
				where: { id, deletedAt: null },
				include: [{
					model: Model.Reference, as: 'reference', required: true,
					where: { cityAs: { [Op.in]: cityList.map(city => city.adcode) } }
				}],
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
		.put('/:referenceId', async function updateReference(ctx) {

		})
		.delete('/:referenceId', async function deleteReference(ctx) {
			const { reference } = ctx.state;

			reference.deletedAt = new Date();
			await reference.save();
			ctx.body = Reference(reference);
		});
});
