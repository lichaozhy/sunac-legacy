const { Router } = require('@produck/duck-web-koa-router');

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
			const { from = 0, size, city = options.defaultCity } = ctx.query;

			const { rows, count } = await Model.Photo.findAndCountAll({
				where: { city, deletedAt: null },
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
			const { customer } = ctx.state;
			const { photoId } = ctx.params;

			const photo = await Model.Photo.findOne({
				where: { id: photoId, city: customer.cityAs },
			});

			if (!photo) {
				return ctx.throw(404, 'The photo is NOT existed');
			}

			photo.like += 1;
			await photo.save();
			ctx.body = { like: photo.like };
		});
});
