const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

const BOOLEAN_REG = /^true|false$/;

module.exports = Router(function SunacLegacyAdministrationTopic(router, {
	Model, AccessControl: $ac, Utils
}) {

	function Topic(data) {
		return {
			id: data.id,
			title: data.title,
			banner: data.banner,
			description: data.description,
			city: data.city,
			read: data.read,
			like: data.like,
			createdAt: data.createdAt,
			validatedAt: data.validatedAt,
			prize: data.PrizeTopic !== null,
			createdBy: {
				id: data.Customer.id,
				wechat: {
					openid: data.Customer.wechat.openid,
					nickname: data.Customer.wechat.nickname,
					headimgurl: data.Customer.wechat.headimgurl
				}
			}
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
			const {
				pageSize = 10000000, pageCurrent = 1,
				validated, city, title, prize
			} = ctx.query;

			const where = { deletedAt: null };

			if (validated) {
				if (!BOOLEAN_REG.test(validated)) {
					return ctx.throw(400, 'Invalid query "?validated="');
				}

				where.validatedAt = validated === 'true' ? { [Op.not]: null } : null;
			}

			if (prize) {
				if (!BOOLEAN_REG.test(prize)) {
					return ctx.throw(400, 'Invalid query "?prize="');
				}
			}

			if (city) {
				where.city = city;
			}

			if (title) {
				where.title = { [Op.like]: `%${title}%` };
			}

			const list = await Model.Topic.findAll({
				where,
				include: [
					{
						model: Model.Customer, required: true,
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }],
					},
					{ model: Model.PrizeTopic, required: prize === 'true', where: { deletedAt: null } }
				],
				offset: (pageCurrent - 1) * pageSize,
				limit: pageSize,
				order: [['createdAt', 'DESC']]
			});

			ctx.body = {
				list: list.map(Topic),
				total: await Model.Topic.count({ where }),
				size: Number(pageSize),
				current: Number(pageCurrent)
			};
		})
		.post('/', async function createTopic(ctx) {
			const { cityList, customer, administrator } = ctx.state;

			if (!customer) {
				return ctx.throw(403, 'You MUST bing a customer');
			}

			const { title, banner, description, city: cityAdcode } = ctx.request.body;

			if (Utils.City.getCity(cityAdcode) === null) {
				return ctx.throw(400, 'bad city adcode.');
			}

			const now = new Date();
			const isManagedCity = cityList.some(city => city.adcode === cityAdcode);
			const id = Utils.encodeSHA256(`${title}${description}${cityAdcode}${now}`);

			const topic = await Model.Topic.create({
				id, title, banner, description, city: cityAdcode, like: 0,
				createdAt: now,
				createdBy: customer.id,
				validatedAt: isManagedCity ? now : null,
				validatedBy: isManagedCity ? administrator.id : null
			});

			topic.Customer = customer;
			ctx.body = Topic(topic);
		})
		.param('topicId', async function fetchTopic(id, ctx, next) {
			const topic = await Model.Topic.findOne({
				where: { id, deletedAt: null },
				include: [
					{
						model: Model.Customer, required: true,
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }],
					}
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
			const { topic, administrator } = ctx.state;

			if (!administrator.cityList.some(city => city.adcode === topic.city)) {
				return ctx.throw(403, 'NOT your city.');
			}

			topic.validatedAt = new Date();
			topic.validatedBy = administrator.id;
			await topic.save();
			ctx.body = Topic(topic);
		})
		.delete('/:topicId', async function deleteTopic(ctx) {
			const { topic, administrator } = ctx.state;

			if (!administrator.cityList.some(city => city.adcode === topic.city)) {
				return ctx.throw(403, 'NOT your city.');
			}

			topic.deletedAt = new Date();
			await topic.save();
			ctx.body = Topic(topic);
		});
});
