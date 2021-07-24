const DuckWebKoa = require('@produck/duck-web-koa');
const DuckWebKoaRouter = require('@produck/duck-web-koa-router');
const DuckWebKoaAcl = require('@produck/duck-web-koa-acl');
const KoaBody = require('koa-body');
const	KoaSession = require('koa-session');
const serve = require('koa-static');
const path = require('path');

const Router = require('./router');

module.exports = DuckWebKoa(function SunacLegacyApplication(app, {
	AppRouter, Workspace, Utils, options
}) {
	app.keys = [Utils.salt()];

	app
		.use(KoaSession(app))
		.use(function validateSession(ctx, next) {
			if (!ctx.session.customerId && ctx.path !== '/api/oauth/wechat') {
				return ctx.redirect(Utils.WechatOauthRedirectURL({
					appid: options.wx.appid,
					origin: options.server.customers.origin,
				}));
			}

			ctx.body = ctx.session.customerId;

			return next();
		})
		.use(KoaBody())
		.use(AppRouter().routes())
		.use(serve(path.resolve('www/maintenance')));
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
					prefix: '/oauth/wechat',
					Router: Router.Wechat
				}
			]
		})
	]
});
