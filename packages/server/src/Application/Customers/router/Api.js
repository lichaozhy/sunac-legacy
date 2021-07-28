const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs-extra');

module.exports = Router(function SunacLegacyApi(router, {
	Model, Workspace, AccessControl: $ac, Utils
}) {
	function Customer(data) {
		return {
			id: data.id,
			createdAt: data.createdAt,
			cityAs: data.cityAs,
			wechat: {
				openid: data.wechat.openid,
				nickname: data.wechat.nickname,
				sex: data.wechat.sex,
				headimgurl: data.wechat.headimgurl
			}
		};
	}

	router
		.use($ac('signed'), async function fetchPrincipalCustomer(ctx) {
			const { customerId } = ctx.session;
			const customer = await Model.Customer.findOne({ where: { id: customerId } });

			ctx.state.customer = customer;
		})
		.get('/customer', async function getPrincipalCustomer(ctx) {
			ctx.body = Customer(ctx.state.customer);
		})
		.get('/customer/today/like', async function getTodayList(ctx) {
			const list = await Model.CustomerLikeShare.findAll({
				where: {
					customer: ctx.state.customer.id,
					createdAt: { [Op.gt]: getToday0() }
				}
			});

			ctx.body = list.map(like => {
				return {
					customer: like.customer,
					share: like.share
				};
			});
		})
		.put('/customer', async function updatePrincipalCustomer(ctx) {
			const { customer } = ctx.state;
			const { cityAs } = ctx.request.body;

			if (Utils.City.getCity(cityAs) !== null) {
				customer.cityAs = cityAs;
			}

			await customer.save();
			ctx.body = Customer(customer);
		})
		.get('/image/:imageId/image.png', async function getImageFile(ctx) {
			const { imageId } = ctx.params;
			const image = await Model.Image.findOne({ where: { id: imageId } });

			if (!image) {
				return ctx.throw(404, 'image is not found.');
			}

			const filepath = Workspace.resolve('image', path.join(imageId, 'image.png'));

			ctx.type = 'png';
			ctx.body = fs.createReadStream(filepath);
		})
		.use(async function validateCustomerCityAs(ctx, next) {
			const { customer } = ctx.state;

			if (customer.cityAs === null) {
				return ctx.throw(400, 'Set your city firstly.');
			}

			return next();
		});
});

function getToday0() {
	return new Date(new Date().toLocaleDateString());
}
