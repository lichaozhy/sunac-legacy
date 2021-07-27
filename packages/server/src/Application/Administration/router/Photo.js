const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

function Photo(data) {
	return {
		id: data.id,
		title: data.title,
		image: data.image,
		like: data.like,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt
	};
}

module.exports = Router(function SunacLegacyAdministrationPhoto(router, {
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
		.get('/', async function getAllPhotoList(ctx) {
			const { pageSize = 10000000, pageCurrent = 1, title } = ctx.query;
			const { cityList } = ctx.state;

			const where = {
				deletedAt: null,
				city: { [Op.in]: cityList.map(city => city.adcode) }
			};

			if (title) {
				where.title = '%title%';
			}

			const { rows, count } = await Model.Photo.findAndCountAll({
				where,
				offset: (pageCurrent - 1) * pageSize,
				limit: pageSize,
				order: ['createdAt', 'DESC']
			});

			ctx.body = {
				list: rows.map(Photo),
				total: count,
				size: pageSize,
				current: pageCurrent
			};
		})
		.post('/', async function createPhoto(ctx) {
			const { cityList } = ctx.state;
			const { title, image, city: cityAdcode } = ctx.request.body;

			if (typeof(title) !== 'string') {
				return ctx.throw(400, 'Invalid ".title".');
			}

			if (typeof(cityAdcode) !== 'string') {
				return ctx.throw(400, 'Invalid ".city".');
			}

			if (!cityList.some(city => city.code === cityAdcode)) {
				return ctx.throw(403, 'The city is NOT yours.');
			}

			const now = new Date();
			const photo = await Model.Photo.create({
				id: Utils.encodeSHA256(`${title}${cityAdcode}${now}`),
				title, city: cityAdcode, image, like: 0,
				createdAt: now
			});

			ctx.body = Photo(photo);
		})
		.param('photoId', async function fetchPhoto(id, ctx, next) {
			const photo = await Model.Photo.findOne({
				where: { id, deletedAt: null }
			});

			if (!photo) {
				return ctx.throw(404, 'photo is NOT found.');
			}

			ctx.state.photo = photo;

			return next();
		})
		.get('/:photoId', async function getPhoto(ctx) {
			ctx.body = Photo(ctx.state.photo);
		})
		.delete('/:photoId', async function deletePhoto(ctx) {
			const { photo } = ctx.state;

			photo.deletedAt = new Date();
			await photo.save();
			ctx.body = Photo(photo);
		});
});
