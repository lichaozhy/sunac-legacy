const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

module.exports = Router(function SunacLegacyApi(router, {
	Model, Utils, ShareLike
}) {

	function Customer(data) {
		return {
			id: data.id,
			cityAs: data.cityAs,
			nickname: data.wechat.nickname,
			headimgurl: data.wechat.headimgurl,
		};
	}

	function Share(data) {
		return {
			id: data.id,
			title: data.title,
			raw: data.raw,
			city: data.city,
			like: ShareLike.get(data.id),
			imageList: data.imageList.map(shareImage => shareImage.image),
			createdAt: data.createdAt,
			createdBy: Customer(data.Customer),
			validatedAt: data.validatedAt
		};
	}

	router
		.get('/customer/city/top', async function getShareTop20OfCityList(ctx) {
			const { customer } = ctx.state;
			const { number = 20 } = ctx.query;
			const idList = ShareLike.top(customer.cityAs, number);

			const where = {
				id: { [Op.in]: idList },
				city: customer.cityAs, deletedAt: null,
			};

			const list = await Model.Share.findAll({
				where,
				include: [
					{ model: Model.ShareImage, as: 'imageList' },
					{
						model: Model.Customer, required: true,
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }]
					},
				],
				order: [['createdAt', 'DESC']]
			});

			ctx.body = idList
				.map(id => list.find(share => share.id === id))
				.filter(share => share)
				.map(Share);
		})
		.get('/top', async function getShareTop20OfCityList(ctx) {
			const { number = 20 } = ctx.query;
			const idList = ShareLike.top(number);

			const list = await Model.Share.findAll({
				where:  { id: { [Op.in]: idList }, deletedAt: null },
				include: [
					{ model: Model.ShareImage, as: 'imageList' },
					{
						model: Model.Customer, required: true,
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }]
					},
				],
				order: [['createdAt', 'DESC']]
			});

			ctx.body = idList
				.map(id => list.find(share => share.id === id))
				.filter(share => share)
				.map(Share);
		})
		.get('/', async function getShareList(ctx) {
			const { customer } = ctx.state;
			const { from = 0, size, createdAt = new Date() } = ctx.query;

			const where = {
				city: customer.cityAs, deletedAt: null,
				createdAt: { [Op.lt]: createdAt },
				[Op.or]: [{ validatedAt: { [Op.not]: null } }, { createdBy: customer.id }],
			};

			const list = await Model.Share.findAll({
				where,
				include: [
					{ model: Model.ShareImage, as: 'imageList' },
					{
						model: Model.Customer, required: true,
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }]
					},
				],
				offset: Number(from),
				limit: Number(size),
				order: [['createdAt', 'DESC']]
			});

			ctx.body = {
				list: list.map(Share),
				total: await Model.Share.count({ where })
			};
		})
		.post('/', async function createShare(ctx) {
			const { customer } = ctx.state;
			const { raw, imageList, title } = ctx.request.body;
			const now = new Date();
			const id = Utils.encodeSHA256(`${raw}${now}`);

			const share = await Model.Share.create({
				id, raw, title,
				city: customer.cityAs,
				createdAt: now, createdBy: customer.id
			});

			share.imageList = await Model.ShareImage.bulkCreate(imageList.map(imageId => {
				return { share: id, image: imageId };
			}));

			share.Customer = customer;
			ctx.body = Share(share);
		})
		.param('shareId', async function fecthShare(id, ctx, next) {
			const { customer } = ctx.state;

			const share = await Model.Share.findOne({
				where: {
					id, deletedAt: null,
					[Op.or]: [{ validatedAt: { [Op.not]: null } }, { createdBy: customer.id }]
				},
				include: [
					{ model: Model.ShareImage, as: 'imageList' },
					{
						model: Model.Customer, required: true,
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }]
					},
				]
			});

			if (!share) {
				return ctx.throw(404, 'The share is NOT existed');
			}

			ctx.state.share = share;

			return next();
		})
		.get('/:shareId', async function getShare(ctx) {
			ctx.body = Share(ctx.state.share);
		})
		.delete('/:shareId', async function deleteShare(ctx) {
			const { share } = ctx.state;

			share.deletedAt = new Date();
			await share.save();
			ctx.body = Share(share);
		})
		.post('/:shareId/like', async function createShareLike(ctx) {
			const { customer, share } = ctx.state;

			const liked = await Model.CustomerLikeShare.findOne({
				where: {
					customer: customer.id,
					share: share.id,
					createdAt: { [Op.gt]: getToday0() }
				}
			});

			if (liked) {
				return ctx.throw(403, 'you liked');
			}

			const now = new Date();
			const like = await Model.CustomerLikeShare
				.create({ customer: customer.id, share: share.id, createdAt: now });

			ShareLike.commit(share.id);

			ctx.body = {
				share: like.share,
				customer: like.customer,
				createdAt: now
			};
		})
		.delete('/:shareId/like', async function deleteShareLike(ctx) {
			const { customer, share } = ctx.state;

			const like = await Model.CustomerLikeShare.findOne({
				where: {
					customer: customer.id,
					share: share.id,
					createdAt: { [Op.gt]: getToday0() }
				}
			});

			if (!like) {
				return ctx.throw(404, 'have NOT liked.');
			}

			await like.destroy();
			ShareLike.revert(share.id);

			ctx.body = {
				share: like.share,
				customer: like.customer,
				createdAt: like.createdAt
			};
		});
});

function getToday0() {
	return new Date(new Date().toLocaleDateString());
}
