const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

function Photo(data) {
	return {
		id: data.id,
		title: data.title,
		image: {
			id: data.imageId
		},
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
			const where = { cityAs: { [Op.in]: cityList.map(city => city.adcode) } };

			if (title) {
				where.title = '%title%';
			}

			const { rows, count } = await Model.Content.findAndCountAll({
				where: { deletedAt: null },
				include: [{ model: Model.Photo, as: 'photo', required: true, where }],
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
			const { title, image, cityAs } = ctx.request.body;
			const { id } = image;

			if (typeof(title) !== 'string') {
				return ctx.throw(400, 'Invalid ".title".');
			}

			if (typeof(cityAs) !== 'string') {
				return ctx.throw(400, 'Invalid ".cityAs".');
			}

			if (!cityList.some(city => city.code === cityAs)) {
				return ctx.throw(403, 'The city is NOT yours.');
			}

			const now = new Date();
			const photo = await Model.Photo.create({
				id: Utils.encodeSHA256(`${title}${cityAs}${now}`),
				createdAt: now, validatedAt: now, updatedAt: now, like: 0,
				photo: { title, cityAs, imageId: id }
			});

			ctx.body = Photo(photo);
		})
		.param('photoId', async function fetchPhoto(id, ctx, next) {
			const photo = await Model.Content.findOne({
				where: { id, deletedAt: null },
				include: [{ model: Model.Photo, as: 'photo', required: true }],
			});

			if (!photo) {
				return ctx.throw(404, 'photo is NOT found.');
			}

			ctx.state.photo = photo;

			return next();
		})
		.put('/:get', async function getPhoto(ctx) {
			ctx.body = Photo(ctx.state.photo);
		})
		.put('/:photoId', async function updatePhoto(ctx) {
			const { title, image, cityAs } = ctx.request.body;
			const { cityList, photo } = ctx.state;

			if (title) {
				if (typeof(title) !== 'string') {
					return ctx.throw(400, 'Invalid ".title".');
				}

				photo.title = title;
			}

			if (image) {
				if (typeof(image) !== 'string') {
					return ctx.throw(400, 'Invalid ".title".');
				}

				photo.image = image;
			}

			if (cityAs) {
				if (!cityList.some(city => city.code === cityAs)) {
					return ctx.throw(403, 'The city is NOT yours.');
				}

				if (typeof(cityAs) !== 'string') {
					return ctx.throw(400, 'Invalid ".cityAs".');
				}

				photo.cityAs = cityAs;
			}

			photo.updatedAt = new Date();
			await photo.save();

			ctx.body = Photo(photo);
		})
		.delete('/:photoId', async function deletePhoto(ctx) {
			const { photo } = ctx.state;

			photo.deletedAt = new Date();
			await photo.save();
			ctx.body = Photo(photo);
		});
});
