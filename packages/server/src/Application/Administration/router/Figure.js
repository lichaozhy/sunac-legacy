const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

function Figure(data) {
	return {
		id: data.id,
		name: data.name,
		profile: data.profile,
		image: data.image,
		href: data.href,
		// city: data.city,
		createdAt: data.createdAt,
	};
}

function isString(any) {
	return typeof any === 'string';
}

module.exports = Router(function SunacLegacyAdministrationFigure(router, {
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
		.get('/', async function getFigureList(ctx) {
			const list = await Model.Figure.findAll({ where: { deletedAt: null } });

			ctx.body = list.map(Figure);
		})
		.post('/', async function createFigure(ctx) {
			const { name, profile, image, href } = ctx.request.body;

			if (!isString(name)) {
				return ctx.throw(400, 'Invalid ".name".');
			}

			if (!isString(profile)) {
				return ctx.throw(400, 'Invalid ".profile".');
			}

			if (!isString(image)) {
				return ctx.throw(400, 'Invalid ".image".');
			}

			if (!isString(href)) {
				return ctx.throw(400, 'Invalid ".href".');
			}

			const now = new Date();

			const figure = await Model.Figure.create({
				id: Utils.encodeSHA256(`${name}${profile}${href}${now}`),
				name, profile, image, href,
				createdAt: now
			});

			ctx.body = Figure(figure);
		})
		.param('figureId', async function fetchFigure(id, ctx, next) {
			const figure = await Model.Figure.findOne({ where: { id, deletedAt: null } });

			if (!figure) {
				return ctx.throw(404);
			}

			ctx.state.figure = figure;

			return next();
		})
		.get('/:figureId', async function getFigure(ctx) {
			ctx.body = Figure(ctx.state.figure);
		})
		.delete('/:figureId', async function deleteFigure(ctx) {
			const { figure } = ctx.state;

			figure.deletedAt = new Date();
			await figure.save();
			ctx.body = Figure(figure);
		});
});
