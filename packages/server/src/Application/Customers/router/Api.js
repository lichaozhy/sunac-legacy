const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs-extra');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');

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

	function Banner(data) {
		return {
			id: data.id,
			image: data.image,
			city: data.city,
			createdAt: data.createdAt
		};
	}

	router
		.get('/dev', async function dispatchRedirect(ctx) {
			ctx.body = { success: 'ok' };
		})
		.use($ac('signed'), async function fetchPrincipalCustomer(ctx, next) {
			const { customerId } = ctx.session;
			const customer = await Model.Customer.findOne({
				where: { id: customerId },
				include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }]
			});

			ctx.state.customer = customer;

			return next();
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
			const { cityAs, phone } = ctx.request.body;

			if (Utils.City.getCity(cityAs) !== null) {
				customer.cityAs = cityAs;
			}

			if (phone) {
				customer.phone = phone;
			}

			await customer.save();
			ctx.body = Customer(customer);
		})
		.get('/image/:imageId/image.png', conditional(), etag(), async function getImageFile(ctx) {
			const { imageId } = ctx.params;
			const image = await Model.Image.findOne({ where: { id: imageId } });

			if (!image) {
				return ctx.throw(404, 'image is not found.');
			}

			const filepath = Workspace.resolve('image', path.join(imageId, 'image.png'));

			ctx.set('Cache-Control', 'max-age=31536000');
			ctx.type = 'png';
			ctx.body = fs.createReadStream(filepath);
		})
		.use(async function validateCustomerCityAs(ctx, next) {
			const { customer } = ctx.state;

			if (customer.cityAs === null) {
				return ctx.throw(400, 'Set your city firstly.');
			}

			return next();
		})
		.get('/banner', async function getMyCityBannerList(ctx) {
			const { customer } = ctx.state;

			const list = await Model.Banner.findAll({
				where: { city: customer.cityAs, deletedAt: null }
			});

			ctx.body = list.map(Banner);
		});
});

function getToday0() {
	return new Date(new Date().toLocaleDateString());
}
