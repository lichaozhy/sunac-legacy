const DuckWebKoa = require('@produck/duck-web-koa');
const DuckWebKoaRouter = require('@produck/duck-web-koa-router');
const DuckWebKoaAcl = require('@produck/duck-web-koa-acl');
const KoaBody = require('koa-body');
const	KoaSession = require('koa-session');
const KoaCompress = require('koa-compress');
const serve = require('koa-static');
const path = require('path');

const Router = require('./router');

module.exports = DuckWebKoa(function SunacLegacyApplication(app, {
	AppRouter, Workspace, Utils
}) {
	const bodyparser = KoaBody({
		multipart: true,
		formidable: {
			uploadDir: Workspace.getPath('temp')
		}
	});

	app.keys = [Utils.salt()];

	app
		.use(KoaCompress())
		.use(serve(path.resolve('www/administration'), { gzip: true, maxAge: 3600000 }))
		.use(KoaSession(app))
		.use(bodyparser)
		.use(AppRouter().routes());
}, {
	plugins: [
		DuckWebKoaAcl({
			asserts: [
				function authenticated(ctx) {
					return Boolean(ctx.session.administratorId);
				},
				function unauthenticated(ctx) {
					return !ctx.session.administratorId;
				}
			],
			table: {
				'principal.authenticate':			[0, 1],
				'signed':											[1, 0]
			}
		}),
		DuckWebKoaRouter({
			prefix: '/api',
			Router: Router.Api,
			use: [
				{
					prefix: '/principal',
					Router: Router.Principal,
				},
				{
					prefix: '/customer',
					Router: Router.Customer
				},
				{
					prefix: '/city',
					Router: Router.City,
				},
				{
					prefix: '/image',
					Router: Router.Image
				},

				{
					prefix: '/reference',
					Router: Router.Reference
				},
				{
					prefix: '/photo',
					Router: Router.Photo
				},
				{
					prefix: '/topic',
					Router: Router.Topic,
					use: [
						{
							prefix: '/:topicId/post',
							Router: Router.Post
						},
						{
							prefix: '/:topicId/prize',
							Router: Router.Prize
						}
					]
				},
				{
					prefix: '/share',
					Router: Router.Share
				},
				{
					prefix: '/banner',
					Router: Router.Banner
				},
				{
					prefix: '/figure',
					Router: Router.Figure
				}

				// {
				// 	prefix: '/comment',
				// 	Router: Router.Comment
				// }
			]
		})
	]
});
