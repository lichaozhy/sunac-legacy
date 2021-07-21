const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function SunacLegacyMaintenanceCity(router, {
	Utils
}) {
	router
		.get('/', async function getCityList(ctx) {
			const { name } = ctx.query;

			ctx.body = Utils.City.getCityList().filter(city => {
				return !name || city.name.indexOf(name) !== -1;
			});
		})
		.get('/:adcode', async function getCityByAdcode(ctx) {
			const { adcode } = ctx.params;

			if (isNaN(Number(adcode)) || adcode.length !== 6) {
				return ctx.throw(400, 'Invalid adcode');
			}

			ctx.body = Utils.City.getCity(adcode);
		})
});
