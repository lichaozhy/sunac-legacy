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

	function Reply(data) {
		return {
			id: data.id,
			post: data.post,
			raw: data.raw,
			createdAt: data.createdAt,
			createdBy: Customer(data.Customer),
			validatedAt: data.validatedAt
		};
	}

	router
		.get('/', async function getReplyList(ctx) {
			const { top = 1000 } = ctx.query;
			const { post, customer } = ctx.state;

			const { rows, count } = await Model.Reply.findAndCountAll({
				where: {
					post: post.id,
					[Op.or]: [{ validatedAt: { [Op.not]: null } }, { createdBy: customer.id }]
				},
				include: [
					{
						model: Model.Customer, required: true,
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }]
					},
				],
				offset: 0,
				limit: Number(top),
				order: [['createdAt', 'DESC']]
			});

			ctx.body = {
				total: count,
				list: rows.map(Reply)
			};
		})
		.post('/', async function createReply(ctx) {
			const { post, customer } = ctx.state;
			const { raw } = ctx.request.body;
			const now = new Date();

			const reply = await Model.Reply.create({
				raw, post: post.id, createdAt: now, createdBy: customer.id,
			});

			reply.Customer = customer;
			ctx.body = Reply(reply);
		});
});
