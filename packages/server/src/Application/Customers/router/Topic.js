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
			description: data.description,
			read: data.read,
			like: data.like,
			prize: data.PrizeTopic !== null,
			createdAt: data.createdAt,
			createdBy: Customer(data.Customer),
			validatedAt: data.validatedAt,
		};
	}

	function Post(data) {
		return {
			id: data.id,
			topic: data.topic,
			raw: data.raw,
			like: data.like,
			imageList: data.imageList.map(shareImage => shareImage.image),
			createdAt: data.createdAt,
			createdBy: Customer(data.Customer),
			validatedAt: data.validatedAt,
		};
	}

	router
		.get('/', async function getTopicList(ctx) {
			const {
				from = 0,
				size,
				createdAt = new Date(),
				prize, hot
			} = ctx.query;

			const order = [['createdAt', 'DESC']];
			const { customer } = ctx.state;

			if (hot === 'true') {
				order.unshift(['read', 'DESC']);
			}

			const { rows, count } = await Model.Topic.findAndCountAll({
				where: {
					deletedAt: null,
					createdAt: { [Op.lt]: createdAt },
					[Op.or]: [{ validatedAt: { [Op.not]: null } }, { createdBy: customer.id }]
				},
				include: [
					{ model: Model.PrizeTopic, required: prize === 'true', where: { deletedAt: null } },
					{
						model: Model.Customer, required: true,
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }]
					},
				],
				offset: from,
				limit: size,
				order: order
			});

			ctx.body = {
				list: rows.map(Topic),
				total: count
			};
		})
		.post('/', async function createTopic(ctx) {
			const { customer } = ctx.state;
			const { title, banner, description } = ctx.request.body;
			const now = new Date();
			const id = Utils.encodeSHA256(`${title}${now}${description}`);

			if (!title || title.length < 4) {
				return ctx.throw(400, 'Invalid ".title"');
			}

			if (!banner || banner.length !== 64) {
				return ctx.throw(400, 'Invalid ".banner"');
			}

			if (!description || description.length < 16) {
				return ctx.throw(400, 'Invalid ".description"');
			}

			const topic = await Model.Topic.create({
				id, title, banner, description,
				city: customer.cityAs, read: 0, like: 0,
				createdAt: now, createdBy: customer.id,
			});

			topic.Customer = customer;
			ctx.body = Topic(topic);
		})
		.param('topicId', async function fetchTopic(id, ctx, next) {
			const { customer } = ctx.state;

			const topic = await Model.Topic.findOne({
				where: {
					id, deletedAt: null,
					[Op.or]: [{ validatedAt: { [Op.not]: null } }, { createdBy: customer.id }]
				},
				include: [
					{
						model: Model.Customer, required: true,
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }]
					},
				],
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
			const {
				from = 0,
				size,
				createdAt = new Date(),
				hot
			} = ctx.query;

			const { customer, topic } = ctx.state;

			const where = {
				topic: topic.id,
				createdAt: { [Op.lt]: createdAt },
				[Op.or]: [{ validatedAt: { [Op.not]: null } }, { createdBy: customer.id }]
			};

			const order = [['createdAt', 'DESC']];

			if (hot === 'true') {
				order.unshift(['like', 'DESC']);
			}

			const list = await Model.Post.findAll({
				where,
				include: [
					{ model: Model.PostImage, as: 'imageList' },
					{
						model: Model.Customer, required: true,
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }]
					},
				],
				offset: from,
				limit: size,
				order: order
			});

			ctx.body = {
				list: list.map(Post),
				total: await Model.Post.count({ where })
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
				id, raw, topic: topic.id, like: 0,
				createdAt: now, createdBy: customer.id
			});

			post.Customer = customer;
			post.imageList = await Model.PostImage.bulkCreate(imageList.map(imageId => {
				return { post: id, image: imageId };
			}));

			ctx.body = Post(post);
		})
		.param('postId', async function fetchPost(id, ctx, next) {
			const { customer } = ctx.state;

			const post = await Model.Post.findOne({
				where: {
					id, deletedAt: null,
					[Op.or]: [{ validatedAt: { [Op.not]: null } }, { createdBy: customer.id }]
				},
				include: [
					{
						model: Model.Customer, required: true,
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }]
					},
				],
			});

			if (!post) {
				return ctx.throw(404, 'The topic is NOT existed');
			}

			ctx.state.post = post;

			return next();
		})
		.get('/:topicId/post/:postId', async function deletePost(ctx) {
			const { post } = ctx.state;

			ctx.body = Post(post);
		})
		.delete('/:topicId/post/:postId', async function deletePost(ctx) {
			const { post } = ctx.state;

			post.deletedAt = new Date();
			await post.save();
			ctx.body = Post(post);
		})
		.post('/:topicId/post/:postId/like', async function likeTopicPost(ctx) {
			const { post } = ctx.state;

			if (post.validatedAt === null) {
				return ctx.throw(403, 'The post is NOT validated.');
			}

			post.like += 1;
			await post.save();
			ctx.body = { like: post.like };
		});
});
