const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

const VALIDATED_REG = /^true|false$/;

module.exports = Router(function SunacLegacyAdministrationShare(router, {
	Model, AccessControl: $ac, Utils
}) {
	function Share(data) {
		return {
			id: data.id,
			title: data.title,
			raw: data.raw,
			city: data.city,
			imageList: data.imageList.map(shareImage => shareImage.image),
			createdBy: {
				id: data.Customer.id,
				wechat: {
					openid: data.Customer.wechat.openid,
					nickname: data.Customer.wechat.nickname,
					headimgurl: data.Customer.wechat.headimgurl
				}
			},
			like: 0,
			createdAt: data.createdAt,
			validatedAt: data.validatedAt,
		};
	}

	router
		.use($ac('signed'), async function getManagedCityList(ctx, next) {
			const { administratorId } = ctx.session;

			const administrator = await Model.Administrator.findOne({
				where: { id: administratorId, deletedAt: null },
				include: [
					{ model: Model.AdministratorCity, as: 'cityList' },
					{
						model: Model.Customer, as: 'customer',
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }]
					},
				]
			});

			ctx.state.cityList = administrator.cityList;
			ctx.state.customer = administrator.customer;
			ctx.state.administrator = administrator;

			return next();
		})
		.get('/', async function getAllShareList(ctx) {
			const { pageSize = 10000000, pageCurrent = 1, validated, city } = ctx.query;
			const where = { deletedAt: null };

			if (validated) {
				if (!VALIDATED_REG.test(validated)) {
					return ctx.throw(400, 'Invalid query "?validated="');
				}

				where.validatedAt = validated === 'true' ? { [Op.not]: null } : null;
			}

			if (city) {
				where.city = city;
			}

			const { rows, count } = await Model.Share.findAndCountAll({
				where,
				include: [
					{ model: Model.ShareImage, as: 'imageList' },
					{
						model: Model.Customer, required: true,
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }],
					},
				],
				offset: (pageCurrent - 1) * pageSize,
				limit: pageSize,
				order: [['createdAt', 'DESC']]
			});

			ctx.body = {
				list: rows.map(Share),
				total: count,
				size: Number(pageSize),
				current: Number(pageCurrent)
			};
		})
		.post('/', async function createShare(ctx) {
			const { cityList, customer, administrator } = ctx.state;

			if (!customer) {
				return ctx.throw(403, 'You MUST bing a customer');
			}

			const { raw, city: cityAdcode, imageList, title } = ctx.request.body;

			if (Utils.City.getCity(cityAdcode) === null) {
				return ctx.throw(400, 'bad city adcode.');
			}

			const now = new Date();
			const isManagedCity = cityList.some(city => city.adcode === cityAdcode);
			const id = Utils.encodeSHA256(`${raw}${cityAdcode}${now}`);

			const share = await Model.Share.create({
				id, raw, title, city: cityAdcode,
				createdAt: now,
				createdBy: customer.id,
				validatedAt: isManagedCity ? now : null,
				validatedBy: isManagedCity ? administrator.id : null
			});

			share.imageList = await Model.ShareImage.bulkCreate(imageList.map(imageId => {
				return { image: imageId, share: id };
			}));

			share.Customer = customer;

			if (isManagedCity) {
				share.Administrator = administrator;
			}

			ctx.body = Share(share);
		})
		.param('shareId', async function fetchShare(id, ctx, next) {
			const share = await Model.Share.findOne({
				where: { id, deletedAt: null },
				include: [
					{ model: Model.ShareImage, as: 'imageList' },
					{
						model: Model.Customer, required: true,
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }],
					},
				],
			});

			if (!share) {
				return ctx.throw(404);
			}

			ctx.state.share = share;

			return next();
		})
		.get('/:shareId', async function getShare(ctx) {
			ctx.body = Share(ctx.state.share);
		})
		.put('/:shareId', async function validateShare(ctx) {
			const { share, administrator } = ctx.state;

			if (!administrator.cityList.some(city => city.adcode === share.city)) {
				return ctx.throw(403, 'NOT your city.');
			}

			share.validatedAt = new Date();
			share.validatedBy = administrator.id;
			await share.save();
			ctx.body = Share(share);
		})
		.delete('/:shareId', async function deleteShare(ctx) {
			const { share, administrator } = ctx.state;

			if (!administrator.cityList.some(city => city.adcode === share.city)) {
				return ctx.throw(403, 'NOT your city.');
			}

			share.deletedAt = new Date();
			await share.save();
			ctx.body = Share(share);
		});
});
