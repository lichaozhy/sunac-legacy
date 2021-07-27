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
			const list = await Model.Post.findAll({
				where: { deletedAt: null, topic: topic.id },
				offset: (pageCurrent - 1) * pageSize,
				limit: pageSize,
				order: [['createdAt', 'DESC']],
				include: [
					{ model: Model.PostImage, as: 'imageList', require: true },
					{ model: Model.Administrator, as: 'validatedBy' },
					{ model: Model.Customer, as: 'createdBy' },
				]
			});

			ctx.body = list.map(Post);
		})
		.post('/', async function createPost(ctx) {
			const { cityList, customer, administrator } = ctx.state;

			if (!customer) {
				return ctx.throw(403, 'You MUST bing a customer');
			}

			const { raw, city: cityAdcode, imageList, topic } = ctx.request.body;
			const now = new Date();
			const isManagedCity = cityList.some(city => city.adcode === cityAdcode);

			const post = await Model.Share.create({
				id: Utils.encodeSHA256(`${raw}${cityAdcode}${now}`),
				topic, raw, imageList, like: 0,
				createdAt: now,
				createdBy: customer.id,
				validatedAt: isManagedCity ? now : null,
				validatedBy: isManagedCity ? administrator.id : null
			}, {
				include: [
					{ model: Model.PostImage, as: 'imageList', required: true },
					{ model: Model.Administrator, as: 'validatedBy' },
					{ model: Model.Customer, as: 'createdBy' },
				]
			});

			ctx.body = Post(post);

		})
		.param('postId', async function fetchPost(id, ctx, next) {
			const post = await Model.Post.findOne({
				where: { id, deletedAt: null },
				include: [
					{ model: Model.PostImage, as: 'imageList', require: true },
					{ model: Model.Administrator, as: 'validatedBy' },
					{ model: Model.Customer, as: 'createdBy' },
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
			const { post } = ctx.state;

			post.validatedAt = new Date();
			await post.save();
			ctx.body = Post(post);
		})
		.delete('/:postId', async function deletePost(ctx) {
			const { post } = ctx.state;

			post.deletedAt = new Date();
			await post.save();
			ctx.body = Post(post);
		});
});
