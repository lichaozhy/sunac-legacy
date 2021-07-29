const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

const VALIDATED_REG = /^true|false$/;

module.exports = Router(function SunacLegacyAdministrationPost(router, {
	Model, AccessControl: $ac, Utils
}) {
	function Post(data) {
		return {
			id: data.id,
			raw: data.raw,
			like: data.like,
			imageList: data.imageList,
			createdAt: data.createdAt,
			createdBy: {
				id: data.Customer.id,
				wechat: {
					openid: data.Customer.wechat.openid,
					nickname: data.Customer.wechat.nickname,
					headimgurl: data.Customer.wechat.headimgurl
				}
			},
			validatedAt: data.validatedAt
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
		.get('/', async function getAllPostList(ctx) {
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

			const { topic } = ctx.state;
			const { rows, count } = await Model.Post.findAndCountAll({
				where: { deletedAt: null, topic: topic.id },
				include: [
					{ model: Model.PostImage, as: 'imageList' },
					{
						model: Model.Customer, required: true,
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }],
					},
				],
				offset: (pageCurrent - 1) * pageSize,
				limit: pageSize,
				order: [['createdAt', 'DESC']],
			});

			ctx.body = {
				list: rows.map(Post),
				total: count,
				size: Number(pageSize),
				current: Number(pageCurrent)
			};
		})
		.post('/', async function createPost(ctx) {
			const { cityList, customer, administrator, topic } = ctx.state;

			if (!customer) {
				return ctx.throw(403, 'You MUST bing a customer');
			}

			const { raw, imageList } = ctx.request.body;
			const now = new Date();
			const isManagedCity = cityList.some(city => city.adcode === topic.city);
			const id = Utils.encodeSHA256(`${raw}${now}`);

			const post = await Model.Post.create({
				id, topic: topic.id, raw, like: 0,
				createdAt: now,
				createdBy: customer.id,
				validatedAt: isManagedCity ? now : null,
				validatedBy: isManagedCity ? administrator.id : null
			});

			post.imageList = await Model.PostImage.bulkCreate(imageList.map(imageId => {
				return { image: imageId, post: id };
			}));

			post.Customer = customer;
			ctx.body = Post(post);
		})
		.param('postId', async function fetchPost(id, ctx, next) {
			const post = await Model.Post.findOne({
				where: { id, deletedAt: null },
				include: [
					{ model: Model.PostImage, as: 'imageList' },
					{
						model: Model.Customer, required: true,
						include: [{ model: Model.WechatOpenid, as: 'wechat', required: true }],
					},
				]
			});

			if (!post) {
				return ctx.throw(404);
			}

			ctx.state.post = post;

			return next();
		})
		.get('/:postId', async function getPost(ctx) {
			ctx.body = Post(ctx.state.post);
		})
		.put('/:postId', async function validatePost(ctx) {
			const { topic, administrator, post } = ctx.state;

			if (!administrator.cityList.some(city => city.adcode === topic.city)) {
				return ctx.throw(403, 'NOT your city.');
			}

			post.validatedAt = new Date();
			post.validatedBy = administrator.id;
			await post.save();
			ctx.body = Post(post);
		})
		.delete('/:postId', async function deletePost(ctx) {
			const { topic, administrator, post } = ctx.state;

			if (!administrator.cityList.some(city => city.adcode === topic.city)) {
				return ctx.throw(403, 'NOT your city.');
			}

			post.deletedAt = new Date();
			await post.save();
			ctx.body = Post(post);
		});
});
