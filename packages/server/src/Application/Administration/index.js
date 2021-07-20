const DuckWebKoa = require('@produck/duck-web-koa');
const DuckWebKoaRouter = require('@produck/duck-web-koa-router');
const DuckWebKoaAcl = require('@produck/duck-web-koa-acl');
const KoaBody = require('koa-body');
const	KoaSession = require('koa-session');
const serve = require('koa-static');
const path = require('path');

const Router = require('./router');

module.exports = DuckWebKoa(function SunacLegacyApplication(app, {
	AppRouter, Workspace
}) {
	const bodyparser = KoaBody({
		multipart: true,
		formidable: {
			uploadDir: Workspace.getPath('temp')
		}
	});

	app
		.use(serve(path.resolve('www/administration')))
		.use(KoaSession(app))
		.use(bodyparser)
		.use(AppRouter().routes());
}, {
	plugins: [
		DuckWebKoaAcl({
			asserts: [
				function authenticated(ctx) {
					return Boolean(ctx.session.managerId);
				},
				function unauthenticated(ctx) {
					return !ctx.session.managerId;
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
					use: [
						{
							prefix: '/administrator',
							Router: Router.Administrator
						}
					]
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
					prefix: '/reference',
					Router: Router.Reference
				},
				{
					prefix: '/photo',
					Router: Router.Photo
				},
				{
					prefix: '/post',
					Router: Router.Post
				},
				{
					prefix: '/topic',
					Router: Router.Topic
				},
				{
					prefix: '/share',
					Router: Router.Share
				},
				{
					prefix: '/comment',
					Router: Router.Comment
				}
			]
		})
	]
});
