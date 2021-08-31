const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

function News(data) {
	return {
		id: data.id,
		title: data.title,
		thumb: data.thumb,
		href: data.href,
		publishedAt: data.publishedAt,
		createdAt: data.createdAt
	};
}

function isString(any) {
	return typeof any === 'string';
}

module.exports = Router(function SunacLegacyAdministrationNews(router, {
	Model, AccessControl: $ac, Utils
}) {
	router
		.use($ac('signed'))
		.get('/', async function getAllNewsList(ctx) {
			const { pageSize = 10000000, pageCurrent = 1, title } = ctx.query;
			const where = { deletedAt: null };

			if (title) {
				where.title = { [Op.like]: `%${title}%` };
			}

			const { rows, count } = await Model.News.findAndCountAll({
				where,
				offset: (pageCurrent - 1) * pageSize,
				limit: pageSize,
				order: [['createdAt', 'DESC']]
			});

			ctx.body = {
				list: rows.map(News),
				total: count,
				size: Number(pageSize),
				current: Number(pageCurrent)
			};
		})
		.post('/', async function createNews(ctx) {
			const { title, href, thumb, publishedAt } = ctx.request.body;

			if (!isString(title)) {
				return ctx.throw(400, 'Invalid ".title".');
			}

			if (!isString(href)) {
				return ctx.throw(400, 'Invalid ".href".');
			}

			if (!isString(thumb)) {
				return ctx.throw(400, 'Invalid ".thumb".');
			}

			if (!isString(publishedAt)) {
				return ctx.throw(400, 'Invalid ".publishedAt".');
			}

			const now = new Date();
			const news = await Model.News.create({
				id: Utils.encodeSHA256(`${title}${href}${publishedAt}${now}`),
				title, href, thumb,
				publishedAt: new Date(publishedAt),
				createdAt: now
			});

			ctx.body = News(news);
		})
		.param('newsId', async function fetchNews(id, ctx, next) {
			const news = await Model.News.findOne({
				where: { id, deletedAt: null }
			});

			if (!news) {
				return ctx.throw(404, `The news id="${id}" is NOT defined.`);
			}

			ctx.state.news = news;

			return next();
		})
		.get('/:newsId', async function getNews(ctx) {
			ctx.body = News(ctx.state.news);
		})
		.delete('/:newsId', async function deleteNews(ctx) {
			const { news } = ctx.state;

			news.deletedAt = new Date();
			await news.save();
			ctx.body = News(news);
		});
});
