const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs-extra');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const fetch = require('node-fetch');
const sharp = require('sharp');

function Image(data) {
	return {
		id: data.id,
		size: data.size,
		createdAt: data.createdAt
	};
}

module.exports = Router(function SunacLegacyApi(router, {
	Model, Workspace, AccessControl: $ac, Utils, Wechat
}) {
	function Customer(data) {
		return {
			id: data.id,
			createdAt: data.createdAt,
			cityAs: data.cityAs,
			phone: data.phone,
			wechat: {
				openid: data.wechat.openid,
				nickname: data.wechat.nickname,
				sex: data.wechat.sex,
				headimgurl: data.wechat.headimgurl
			}
		};
	}

	async function getWechatMedia(mediaId) {
		const queryString = [
			`access_token=${Wechat.accessToken}`,
			`media_id=${mediaId}`
		].join('&');

		const res = await fetch(`https://api.weixin.qq.com/cgi-bin/media/get?${queryString}`);

		return res.buffer();
	}

	router
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
			ctx.set('Cache-Control', 'max-age=3600');
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
		.post('/image', async function createImage(ctx) {
			const { mediaId } = ctx.request.body;

			if (!mediaId) {
				return ctx.throw(400, '".mediaId" required.');
			}

			const imageFileBuffer = await getWechatMedia(mediaId);
			const hash = Utils.encodeSHA256(imageFileBuffer);
			const existedImage = await Model.Image.findOne({ where: { id: hash } });

			if (existedImage) {
				return ctx.body = Image(existedImage);
			}

			const pngBuffer = await sharp(imageFileBuffer).resize(600).png({
				compressionLevel: 9,
				palette: true,
				quality: 50,
				colors: 128
			}).toBuffer();

			const storeDir = Workspace.resolve('image', hash);

			if (!await fs.pathExists(storeDir)) {
				await fs.mkdir(storeDir);
				await fs.writeFile(path.join(storeDir, 'raw.png'), imageFileBuffer);
				await fs.writeFile(path.join(storeDir, 'image.png'), pngBuffer);
			}

			const imageData = await Model.Image.create({
				id: hash,
				size: imageFileBuffer.size,
				createdAt: new Date()
			});

			ctx.body = Image(imageData);
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
