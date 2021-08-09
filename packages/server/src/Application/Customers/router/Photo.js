const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

module.exports = Router(function SunacLegacyApi(router, {
	Model, options
}) {
	function Photo(data) {
		return {
			id: data.id,
			title: data.title,
			image: data.image,
			city: data.city,
			like: data.like,
			createdAt: data.createdAt
		};
	}

	router
		.get('/', async function getPhotoList(ctx) {
			const {
				from = 0,
				size,
				city = options.defaultCity,
				createdAt = new Date()
			} = ctx.query;

			const { rows, count } = await Model.Photo.findAndCountAll({
				where: {
					city,
					deletedAt: null,
					createdAt: { [Op.lt]: createdAt },
				},
				offset: from,
				limit: size,
				order: [['createdAt', 'DESC']]
			});

			ctx.body = {
				list: rows.map(Photo),
				total: count
			};
		})
		.post('/:photoId/like', async function createPhotoLike(ctx) {
			const { photoId } = ctx.params;

			const photo = await Model.Photo.findOne({
				where: { id: photoId },
			});

			if (!photo) {
				return ctx.throw(404, 'The photo is NOT existed');
			}

			photo.like += 1;
			await photo.save();
			ctx.body = { like: photo.like };
		});
});
