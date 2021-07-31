const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

function Prize() {

}

module.exports = Router(function SunacLegacyAdministrationTopicPrize(router, {
	Model, Utils
}) {
	function Prize(data) {
		return {
			id: data.id,
			topic: data.topic,
			createdAt: data.createdAt
		};
	}

	router
		.use(async function fetchPrize(ctx, next) {
			const { topic } = ctx.state;

			ctx.state.prize = await Model.PrizeTopic.findOne({
				where: { deletedAt: null, topic: topic.id }
			});

			return next();
		})
		.post('/prize', async function createPrize(ctx) {
			const { prize, topic } = ctx.state;

			if (prize) {
				return ctx.throw(403, 'There has been a prize of the topic.');
			}

			const now = new Date();

			const newPrize = await Model.PrizeTopic.create({
				id: Utils.encodeSHA256(`${now}${topic.id}`),
				topic: topic.id,
				createdAt: now
			});

			ctx.body = Prize(newPrize);
		})
		.use(function isPrizeExisted(ctx, next) {
			const { prize } = ctx.state;

			if (!prize) {
				return ctx.throw(404);
			}

			return next();
		})
		.get('/prize', async function getPrize(ctx) {
			ctx.body = Prize(ctx.state.prize);
		})
		.delete('/prize', async function deletePrize(ctx) {
			const { prize } = ctx.state;

			prize.deletedAt = new Date();
			await prize.save();
			ctx.body = Prize(prize);
		});
});
