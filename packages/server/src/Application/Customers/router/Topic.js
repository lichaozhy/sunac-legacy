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

	function Topic(data) {
		return {
			id: data.id,
			title: data.title,
			banner: data.banner,
			desription: data.desription,
			read: data.read,
			like: data.like,
			createdAt: data.createdAt,
			createdBy: Customer(data.customer),
			validatedAt: data.validatedAt,
		};
	}

	function Post(data) {
		return {
			id: data.id,
			topic: data.topic,
			raw: data.raw,
			imageList: data.imageList,
			createdAt: data.createdAt,
			createdBy: Customer(data.customer),
			validatedAt: data.validatedAt,
		};
	}

	router
		.get('/', async function getTopicList(ctx) {
			const { from = 0, size } = ctx.query;
			const { customer } = ctx.state;

			const { rows, count } = await Model.Topic.findAndCountAll({
				where: {
					city: customer.cityAs, deletedAt: null,
					[Op.or]: [{ validatedAt: { [Op.not]: null } }, { createdBy: customer.id }]
				},
				offset: from,
				limit: size,
				order: [['createdAt', 'DESC']]
			});

			return {
				list: rows.map(Topic),
				total: count
			};
		})
		.post('/', async function createTopic(ctx) {
			const { customer } = ctx.state;
			const { title, banner, description } = ctx.request.body;
			const now = new Date();
			const id = Utils.encodeSHA256(`${title}${now}${description}`);

			const topic = await Model.Topic.create({
				id, title, banner, description,
				city: customer.cityAs, read: 0, like: 0,
				createdAt: now, createdBy: customer.id,
			});

			topic.createdBy = customer;
			ctx.body = Topic(topic);
		})
		.param('topicId', async function fetchTopic(id, ctx, next) {
			const { customer } = ctx.state;

			const topic = await Model.Topic.findOne({
				where: {
					id, city: customer.cityAs, deletedAt: null,
					[Op.or]: [{ validatedAt: { [Op.not]: null } }, { createdBy: customer.id }]
				},
			});

			if (!topic) {
				return ctx.throw(404, 'The topic is NOT existed');
			}

			ctx.state.topic = topic;

			return next();
		})
		.get('/:topicId', async function getTopic(ctx) {
			const { topic } = ctx.state;

			topic.read += 1;
			await topic.save();
			ctx.body = Topic(topic);
		})
		.delete('/:topicId', async function deleteTopic(ctx) {
			const { topic, customer } = ctx.state;

			if (topic.customer !== customer.id) {
				return ctx.throw(403, 'You are NOT the owner of this topic.');
			}

			topic.deletedAt = new Date();
			await topic.save();
			ctx.body = Topic(topic);
		})
		.post('/:topicId/like', async function likeTopic(ctx) {
			const { topic } = ctx.state;

			topic.like += 1;
			await topic.save();
			ctx.body = { like: topic.like };
		})

		.get('/:topicId/post', async function getTopicPostList(ctx) {
			const { from = 0, size } = ctx.query;
			const { customer, topic } = ctx.state;

			const { rows, count } = await Model.Post.findAndCountAll({
				where: {
					topic: topic.id,
					[Op.or]: [{ validatedAt: { [Op.not]: null } }, { createdBy: customer.id }]
				},
				offset: from,
				limit: size,
				order: [['createdAt', 'DESC']]
			});

			ctx.body = {
				list: rows.map(Post),
				total: count
			};
		})
		.post('/:topicId/post', async function createTopicPost(ctx) {
			const { customer, topic } = ctx.state;

			if (topic.validatedAt === null) {
				return ctx.throw(403, 'The topic is NOT validated.');
			}

			const { raw, imageList } = ctx.request.body;

			const now = new Date();
			const id = Utils.encodeSHA256(`${raw}${now}`);

			const post = await Model.Post.create({
				id, raw, topic: topic.id,
				createdAt: now, createdBy: customer.id
			});

			post.createdBy = customer;
			post.imageList = await Model.PostImage.bulkCreate(imageList.map(imageId => {
				return { post: id, image: imageId };
			}));

			ctx.body = Post(post);
		})
		.param('postId', async function fetchPost(id, ctx, next) {
			const { customer } = ctx.state;

			const topic = await Model.Post.findOne({
				where: {
					id, city: customer.cityAs, deletedAt: null,
					[Op.or]: [{ validatedAt: { [Op.not]: null } }, { createdBy: customer.id }]
				},
			});

			if (!topic) {
				return ctx.throw(404, 'The topic is NOT existed');
			}

			ctx.state.topic = topic;

			return next();
		})
		.delete('/:topicId/post/:postId', async function deletePost(ctx) {
			const { post } = ctx.state;

			post.deletedAt = new Date();
			await post.save();
			ctx.body = Post(post);
		})
		.post('/:topicId/post/:postId/like', async function likeTopicPost(ctx) {
			const { post } = ctx.state;

			post.like += 1;
			await post.save();
			ctx.body = { like: post.like };
		});
});
