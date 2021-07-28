const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

module.exports = Router(function SunacLegacyApi(router, {
	Model, Utils
}) {

	function Customer(data) {
		return {
			id: data.id,
			nickname: data.wechat.nickname,
			headimgurl: data.wechat.headimgurl,
		};
	}

	function Share(data) {
		return {
			id: data.id,
			raw: data.raw,
			city: data.city,
			createdAt: data.createdAt,
			createdBy: Customer(data.customer),
			validatedAt: data.validatedAt,
			like: data.like
		};
	}

	router
		.get('/', async function getShareList(ctx) {
			const { customer } = ctx.state;
			const { from = 0, size } = ctx.query;

			const { rows, count } = await Model.Share.findAndCountAll({
				where: {
					city: customer.cityAs, deletedAt: null,
					[Op.or]: [{ validatedAt: { [Op.not]: null } }, { createdBy: customer.id }]
				},
				offset: from,
				limit: size,
				order: [['createdAt', 'DESC']]
			});

			ctx.body = {
				list: rows.map(Share),
				total: count
			};
		})
		.post('/', async function createShare(ctx) {
			const { customer } = ctx.state;
			const { raw, imageList } = ctx.request.body;
			const now = new Date();
			const id = Utils.encodeSHA256(`${raw}${now}`);

			const share = await Model.Share.create({
				id, raw,
				city: customer.cityAs,
				createdAt: now, createdBy: customer.id
			});

			share.imageList = await Model.PostImage.bulkCreate(imageList.map(imageId => {
				return { share: id, image: imageId };
			}));

			share.like = 0;

			ctx.body = Share(share);
		})
		.post('/:shareId/like', async function createShareLike(ctx) {
			const { customer } = ctx.state;
			const { share } = ctx.request.body;

			const liked = await Model.CustomerLikeShare.findOne({
				where: {
					customer: customer.id,
					share,
					createdAt: { [Op.gt]: getToday0() }
				}
			});

			if (liked) {
				return ctx.throw(403, 'you liked');
			}

			const now = new Date();
			const like = await Model.CustomerLikeShare.create({
				customer: customer.id, share, createdAt: now
			});

			ctx.body = {
				share: like.share,
				customer: like.customer,
				createdAt: now
			};
		});
});

function getToday0() {
	return new Date(new Date().toLocaleDateString());
}
