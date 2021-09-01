const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

function Programme(data) {
	return {
		id: data.id,
		title: data.title,
		thumb: data.thumb,
		href: data.href,
		publishedAt: data.publishedAt,
		createdAt: data.createdAt
	};
}

function isString(any) {
	return typeof any === 'string';
}

module.exports = Router(function SunacLegacyAdministrationProgramme(router, {
	Model, AccessControl: $ac, Utils
}) {
	router
		.use($ac('signed'))
		.get('/', async function getAllProgrammeList(ctx) {
			const { pageSize = 10000000, pageCurrent = 1, title } = ctx.query;
			const where = { deletedAt: null };

			if (title) {
				where.title = { [Op.like]: `%${title}%` };
			}

			const { rows, count } = await Model.Programme.findAndCountAll({
				where,
				offset: (pageCurrent - 1) * pageSize,
				limit: pageSize,
				order: [['createdAt', 'DESC']]
			});

			ctx.body = {
				list: rows.map(Programme),
				total: count,
				size: Number(pageSize),
				current: Number(pageCurrent)
			};
		})
		.post('/', async function createProgramme(ctx) {
			const { title, href, thumb, publishedAt } = ctx.request.body;

			if (!isString(title)) {
				return ctx.throw(400, 'Invalid ".title".');
			}

			if (!isString(href)) {
				return ctx.throw(400, 'Invalid ".href".');
			}

			if (!isString(thumb)) {
				return ctx.throw(400, 'Invalid ".thumb".');
			}

			if (!isString(publishedAt)) {
				return ctx.throw(400, 'Invalid ".publishedAt".');
			}

			const now = new Date();
			const programme = await Model.Programme.create({
				id: Utils.encodeSHA256(`${title}${href}${publishedAt}${now}`),
				title, href, thumb,
				publishedAt: new Date(publishedAt),
				createdAt: now
			});

			ctx.body = Programme(programme);
		})
		.param('programmeId', async function fetchProgramme(id, ctx, next) {
			const programme = await Model.Programme.findOne({
				where: { id, deletedAt: null }
			});

			if (!programme) {
				return ctx.throw(404, `The programme id="${id}" is NOT defined.`);
			}

			ctx.state.programme = programme;

			return next();
		})
		.get('/:programmeId', async function getProgramme(ctx) {
			ctx.body = Programme(ctx.state.programme);
		})
		.delete('/:programmeId', async function deleteProgramme(ctx) {
			const { programme } = ctx.state;

			programme.deletedAt = new Date();
			await programme.save();
			ctx.body = Programme(programme);
		});
});
