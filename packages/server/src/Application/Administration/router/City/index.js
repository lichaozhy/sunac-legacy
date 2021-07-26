const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function SunacLegacyAdministrationCity(router, {
	Utils, options
}) {
	router
		.get('/', async function getCityList(ctx) {
			const { name } = ctx.query;

			ctx.body = options.cityList
				.map(adcode => Utils.City.getCity(adcode))
				.filter(city => !name || city.name.indexOf(name) !== -1);
		})
		.get('/:adcode', async function getCityByAdcode(ctx) {
			const { adcode } = ctx.params;

			if (isNaN(Number(adcode)) || adcode.length !== 6 || options.cityList.indexOf(adcode) === -1) {
				return ctx.throw(400, 'Invalid adcode');
			}

			ctx.body = Utils.City.getCity(adcode);
		});
});
