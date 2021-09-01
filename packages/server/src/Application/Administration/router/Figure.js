const { Router } = require('@produck/duck-web-koa-router');

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
			const id = Utils.encodeSHA256(`${name}${profile}${href}${now}`);

			const figure = await Model.Figure.create({
				id, name, profile, image, href, createdAt: now
			});

			const body = normalizeFigureFile({});

			body.id = id;
			await Model.FigureFile.create({ figureId: figure.id, body: JSON.stringify(body) });
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
		})
		.get('/:figureId/file', async function getFigureFile(ctx) {
			const { figure } = ctx.state;

			const figureFile = await Model.FigureFile.findOne({
				where: { figureId: figure.id }
			});

			ctx.type = 'json';
			ctx.body = figureFile.body;
		})
		.put('/:figureId/file', async function updateFigureFile(ctx) {
			const { figure } = ctx.state;
			const finalFigureFileOptions = normalizeFigureFile(ctx.request.body);

			const figureFile = await Model.FigureFile.findOne({
				where: { figureId: figure.id }
			});

			finalFigureFileOptions.id = figure.id;
			figureFile.body = JSON.stringify(finalFigureFileOptions);
			await figureFile.save();
			ctx.body = finalFigureFileOptions;
		});
});

function normalizeFigureFile(_options) {
	const finalOptions = {
		banner: '',
		profile: {
			name: '',
			title: '',
			bornIn: '',
			category: '',
			city: '',
			field: '',
			duration: '',
		},
		photo: '',
		workList: [],
		description: '',
		referenceList: []
	};

	const {
		banner: _banner = finalOptions.banner,
		profile: _profile = finalOptions.profile,
		photo: _photo = finalOptions.photo,
		workList: _workList = finalOptions.workList,
		description: _description = finalOptions.description,
		referenceList: _referenceList = finalOptions.referenceList
	} = _options;

	if (_profile) {
		const {
			name: _name = finalOptions.profile.name,
			title: _title = finalOptions.profile.title,
			bornIn: _bornIn = finalOptions.profile.bornIn,
			category: _category = finalOptions.profile.category,
			city: _city = finalOptions.profile.city,
			field: _field = finalOptions.profile.field,
			duration: _duration = finalOptions.profile.duration
		} = _profile;

		finalOptions.profile.name = _name;
		finalOptions.profile.title = _title;
		finalOptions.profile.bornIn = _bornIn;
		finalOptions.profile.category = _category;
		finalOptions.profile.city = _city;
		finalOptions.profile.field = _field;
		finalOptions.profile.duration = _duration;
	}

	finalOptions.banner = _banner;
	finalOptions.photo = _photo;
	finalOptions.description = _description;
	finalOptions.workList = _workList.map(work => String(work));
	finalOptions.referenceList = _referenceList.map(reference => String(reference));

	return finalOptions;
}
