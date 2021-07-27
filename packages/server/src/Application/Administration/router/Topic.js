const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

const VALIDATED_REG = /^true|false$/;

module.exports = Router(function SunacLegacyAdministrationTopic(router, {
	Model, AccessControl: $ac, Utils
}) {

	function Topic(data) {
		return {
			id: data.id,
			title: data.title,
			banner: data.banner,
			description: data.description,
			ciry: data.city,
			read: data.read,
			createdAt: data.createdAt,
			validatedAt: data.validatedAt,
			createdBy: data.createdBy,
			validatedBy: data.validatedBy
		};
	}

	function Post(data) {
		return {
			id: data.id,
			raw: data.raw,
			imageList: data.imageList,
			createdAt: data.createdAt,
			createdBy: data.createdBy,
			validatedAt: data.validatedAt,
			validatedBy: data.validatedBy
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
		.get('/', async function getAllTopicList(ctx) {
			const { pageSize = 10000000, pageCurrent = 1, validated, city } = ctx.query;
			const where = { deletedAt: null };

			if (validated) {
				if (VALIDATED_REG.test(validated)) {
					return ctx.throw(400, 'Invalid query "?validated="');
				}

				where.validatedAt = validated === true ? { [Op.not]: null } : null;
			}

			if (city) {
				where.city = city;
			}

			const { rows, count } = await Model.Topic.findAndCountAll({
				where,
				include: [
					{ model: Model.Administrator, as: 'validatedBy' },
					{ model: Model.Customer, as: 'createdBy' },
				],
				offset: (pageCurrent - 1) * pageSize,
				limit: pageSize,
				order: [['createdAt', 'DESC']]
			});

			ctx.body = {
				list: rows.map(Topic),
				total: count,
				size: pageSize,
				current: pageCurrent
			};
		})
		.post('/', async function createTopic(ctx) {
			const { cityList, customer, administrator } = ctx.state;

			if (!customer) {
				return ctx.throw(403, 'You MUST bing a customer');
			}

			const { title, banner, description, city: cityAdcode } = ctx.request.body;
			const now = new Date();
			const isManagedCity = cityList.some(city => city.adcode === cityAdcode);

			const topic = await Model.Topic.create({
				id: Utils.encodeSHA256(`${title}${description}${cityAdcode}${now}`),
				title, banner, description, city: cityAdcode,
				createdAt: now,
				createdBy: customer.id,
				validatedAt: isManagedCity ? now : null,
				validatedBy: isManagedCity ? administrator.id : null
			}, {
				include: [
					{ model: Model.Administrator, as: 'validatedBy' },
					{ model: Model.Customer, as: 'createdBy' },
				]
			});

			ctx.body = Topic(topic);
		})
		.param('topicId', async function fetchTopic(id, ctx, next) {
			const topic = await Model.Topic.findOne({
				where: { id, deletedAt: null },
				include: [
					{ model: Model.Administrator, as: 'validatedBy' },
					{ model: Model.Customer, as: 'createdBy' },
				]
			});

			if (!topic) {
				return ctx.throw(404);
			}

			ctx.state.topic = topic;

			return next();
		})
		.get('/:topicId', async function getTopic(ctx) {
			ctx.body = Topic(ctx.state.topic);
		})
		.put('/:topicId', async function validateTopic(ctx) {
			const { topic } = ctx.state;

			topic.validatedAt = new Date();
			await topic.save();
			ctx.body = Topic(topic);
		})
		.delete('/:topicId', async function deleteTopic(ctx) {
			const { topic } = ctx.state;

			topic.deletedAt = new Date();
			await topic.save();
			ctx.body = Topic(topic);
		})
		.get('/:topic/post', async function getTopicAllPostList(ctx) {
			const { topic } = ctx.state;
			const list = await Model.Post.findAll({
				where: { deletedAt: null, topic: topic.id },
				order: [['createdAt', 'DESC']],
				include: [
					{ model: Model.PostImage, as: 'imageList', require: true },
					{ model: Model.Administrator, as: 'validatedBy' },
					{ model: Model.Customer, as: 'createdBy' },
				]
			});

			ctx.body = list.map(Post);
		});
});
