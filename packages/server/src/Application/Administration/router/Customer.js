const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

function Customer(data) {
	return {
		id: data.id,
		name: data.name,
		phont: data.phone,
		cityAs: data.cityAs,
		createdAt: data.createdAt,
		wechat: {
			openid: data.wechat.openid,
			nickname: data.wechat.nickname,
			sex: data.wechat.sex,
			headimgurl: data.wechat.headimgurl
		}
	};
}

module.exports = Router(function SunacLegacyAdministrationCustomer(router, {
	Model
}) {
	router
		.get('/', async function getAllCustomer(ctx) {
			const { name, pageSize = 10000000, pageCurrent = 1 } = ctx.query;
			const where = {};

			if (name) {
				where.name = { [Op.like]: `%${name}%` };
			}

			const { rows, count } = await Model.Customer.findAndCountAll({
				where,
				include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }],
				offset: (pageCurrent - 1) * pageSize,
				limit: pageSize
			});

			ctx.body = {
				list: rows.map(Customer),
				total: count,
				size: pageSize,
				current: pageCurrent
			};
		})
		.get('/:customerId', async function getCustomer(ctx) {
			const { customerId } = ctx.params;

			const customer = await Model.Customer.findAndCountAll({
				where: { id: customerId },
				include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }]
			});

			if (!customer) {
				return ctx.throw(404, 'Customer is NOT found.');
			}

			ctx.body = Customer(customer);
		});
});
