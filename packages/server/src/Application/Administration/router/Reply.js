const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

const VALIDATED_REG = /^true|false$/;

module.exports = Router(function SunacLegacyAdministrationPost(router, {
	Model, AccessControl: $ac, Utils
}) {

	function Customer() {

	}

	function Reply(data) {

	}

	router
		.get('/', async function getAllPostList(ctx) {
			const { post } = ctx.state;

			const list = await Model.Reply.findAll({
				where: { post: post.id, deletedAt: null },
				include: [{
					model: Model.Customer, required: true,
					include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }],
				}]
			});

			ctx.body = list.map(Reply);
		})
		.post('/', async function createReply(ctx) {

		})
		.param('replyId', async function fetchReply(id, ctx, next) {
			const reply = await Model.Reply.findOne({ where: { id } });

			if (!reply) {
				return ctx.throw(404, 'no reply');
			}

			ctx.state.reply = reply;

			return next();
		})
		.put('/:replyId', async function validateReply(ctx) {
			const { reply, administrator } = ctx.state;

			reply.validatedAt = new Date();
			reply.validatedBy = administrator.id;
			await reply.save();
			ctx.body = Reply(reply);
		})
		.delete('/:replyId', async function deleteReply(ctx) {
			const { reply, administrator, topic } = ctx.state;

			if (!administrator.cityList.some(city => city.adcode === topic.city)) {
				return ctx.throw(403, 'NOT your city.');
			}

			reply.deletedAt = new Date();
			await reply.save();
			ctx.body = Reply(reply);
		});


});
