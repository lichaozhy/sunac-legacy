const DuckWebKoa = require('@produck/duck-web-koa');
const DuckWebKoaRouter = require('@produck/duck-web-koa-router');
const DuckWebKoaAcl = require('@produck/duck-web-koa-acl');
const KoaBody = require('koa-body');
const KoaSession = require('koa-session');
const KoaCompress = require('koa-compress');
const serve = require('koa-static');
const path = require('path');

const Router = require('./router');

module.exports = DuckWebKoa(function SunacLegacyApplication(app, {
	AppRouter, Workspace, Utils, options, Model
}) {
	app.keys = [Utils.salt()];

	app
		.use(KoaCompress())
		.use(KoaSession(app))
		.use(async function validateSession(ctx, next) {
			if (ctx.path.indexOf('/api/image/') === 0) {
				return next();
			}

			if (!ctx.session.customerId) {
				if (ctx.path === '/api/wechat/jssdk/config') {
					return ctx.throw(403);
				}

				if (ctx.path !== '/api/wechat/oauth') {
					const { shareType, shareItemId } = ctx.query;

					const redirectOptions = {
						appid: options.wx.appid,
						origin: options.server.customers.origin,
					};

					if (shareType) {
						redirectOptions.state = `${shareType}-${shareItemId}`;
					}

					return ctx.redirect(Utils.WechatOauthRedirectURL(redirectOptions));
				}
			}

			return next();
		})
		.use(KoaBody())
		.use(AppRouter().routes())
		.use(serve(path.resolve('www/customers'), { maxAge: 3600000 }));
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
							prefix: '/news',
							Router: Router.News
						},
						{
							prefix: '/programme',
							Router: Router.Programme
						},
						{
							prefix: '/share',
							Router: Router.Share
						},
						{
							prefix: '/topic',
							Router: Router.Topic,
							use: [
								{
									prefix: '/:topicId/Post',
									Router: Router.Post,
									use: [
										{
											prefix: '/:postId/reply',
											Router: Router.Reply
										}
									]
								}
							]
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
