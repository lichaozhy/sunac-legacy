const DuckWebKoa = require('@produck/duck-web-koa');
const DuckWebKoaRouter = require('@produck/duck-web-koa-router');
const DuckWebKoaAcl = require('@produck/duck-web-koa-acl');
const KoaBody = require('koa-body');
const	KoaSession = require('koa-session');
const serve = require('koa-static');
const path = require('path');

const Router = require('./router');

module.exports = DuckWebKoa(function SunacLegacyApplication(app, {
	AppRouter, Workspace, Utils, options, Model
}) {
	app.keys = [Utils.salt()];

	app
		.use(KoaSession(app))
		.use(async function validateSession(ctx, next) {
			if (!ctx.session.customerId && options.server.customers.dev) {
				const customer = await Model.Customer.findOne();

				ctx.session.customerId = customer.id;
			}

			if (!ctx.session.customerId && ctx.path !== '/api/wechat/oauth') {
				return ctx.redirect(Utils.WechatOauthRedirectURL({
					appid: options.wx.appid,
					origin: options.server.customers.origin,
				}));
			}

			return next();
		})
		.use(KoaBody())
		.use(AppRouter().routes())
		.use(function (ctx, next) {
			ctx.set('Cache-Control', 'max-age=3600');

			return next();
		}, serve(path.resolve('www/customers')));
}, {
	plugins: [
		DuckWebKoaAcl({
			asserts: [
				function authenticated(ctx) {
					return Boolean(ctx.session.customerId);
				},
				function unauthenticated(ctx) {
					return !ctx.session.customerId;
				}
			],
			table: {
				'principal.authenticate':			[0, 1],
				'signed':											[1, 0]
			}
		}),
		DuckWebKoaRouter({
			Router: function RootRouter() {},
			use: [
				{
					prefix: '/api/wechat',
					Router: Router.Wechat
				},
				{
					prefix: '/api',
					Router: Router.Api,
					use: [
						{
							prefix: '/city',
							Router: Router.City
						},
						{
							prefix: '/photo',
							Router: Router.Photo
						},
						{
							prefix: '/reference',
							Router: Router.Reference
						},
						{
							prefix: '/share',
							Router: Router.Share
						},
						{
							prefix: '/topic',
							Router: Router.Topic
						},
						{
							prefix: '/figure',
							Router: Router.Figure
						},
					]
				}
			]
		})
	]
});
