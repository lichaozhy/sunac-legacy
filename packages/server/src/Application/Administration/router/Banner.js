const { Router } = require('@produck/duck-web-koa-router');

function Banner(data) {
	return {
		id: data.id,
		image: data.image,
		city: data.city,
		createdAt: data.createdAt
	};
}

module.exports = Router(function SunacLegacyAdministrationBanner(router, {
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
		.get('/', async function getAllBannerList(ctx) {
			const { city: cityAdcode } = ctx.query;
			const { cityList } = ctx.state;

			if (!cityAdcode) {
				return ctx.throw(400, '".city" required.');
			}

			if (!cityList.some(city => city.adcode === cityAdcode)) {
				return ctx.throw(403, 'NOT your city');
			}

			const list = await Model.Banner.findAll({
				where: { deletedAt: null, city: cityAdcode }
			});

			ctx.body = list.map(Banner);
		})
		.post('/', async function createBanner(ctx) {
			const { cityList } = ctx.state;
			const { image, city: cityAdcode } = ctx.request.body;

			if (typeof(cityAdcode) !== 'string') {
				return ctx.throw(400, 'Invalid ".city".');
			}

			if (!cityList.some(city => city.adcode === cityAdcode)) {
				return ctx.throw(403, 'The city is NOT yours.');
			}

			const now = new Date();
			const banner = await Model.Banner.create({
				id: Utils.encodeSHA256(`${cityAdcode}${now}`),
				city: cityAdcode, image,
				createdAt: now
			});

			ctx.body = Banner(banner);
		})
		.param('bannerId', async function fetchBanner(id, ctx, next) {
			const { cityList } = ctx.state;

			const banner = await Model.Banner.findOne({
				where: { id, deletedAt: null }
			});

			if (!banner) {
				return ctx.throw(404, 'banner is NOT found.');
			}

			if (!cityList.some(city => city.adcode === banner.city)) {
				return ctx.throw(403, 'The city is NOT yours.');
			}

			ctx.state.banner = banner;

			return next();
		})
		.delete('/:bannerId', async function deleteBanner(ctx) {
			const { banner } = ctx.state;

			banner.deletedAt = new Date();
			await banner.save();
			ctx.body = Banner(banner);
		});
});
