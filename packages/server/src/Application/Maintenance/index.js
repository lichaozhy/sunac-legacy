const DuckWebKoa = require('@produck/duck-web-koa');
const DuckWebKoaRouter = require('@produck/duck-web-koa-router');
const DuckWebKoaAcl = require('@produck/duck-web-koa-acl');
const KoaBody = require('koa-body');
const	KoaSession = require('koa-session');
const serve = require('koa-static');
const path = require('path');

const Router = require('./router');

module.exports = DuckWebKoa(function SunacLegacyApplication(app, {
	AppRouter, Workspace, Utils
}) {
	app.keys = [Utils.salt()];

	app
		.use(serve(path.resolve('www/maintenance')))
		.use(KoaSession(app))
		.use(KoaBody())
		.use(AppRouter().routes());
}, {
	plugins: [
		DuckWebKoaAcl({
			asserts: [
				function authenticated(ctx) {
					return Boolean(ctx.session.maintainerId);
				},
				function unauthenticated(ctx) {
					return !ctx.session.maintainerId;
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
					Router: Router.Principal
				},
				{
					prefix: '/maintainer',
					Router: Router.Maintainer,
				},
				{
					prefix: '/administrator',
					Router: Router.Administrator
				},
				{
					prefix: '/city',
					Router: Router.City
				}
			]
		})
	]
});
