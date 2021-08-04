const Duck = require('@produck/duck');
const DuckWeb = require('@produck/duck-web');
const DuckLog = require('@produck/duck-log');
const DuckWorkspace = require('@produck/duck-workspace');
const http = require('http');
const http2 = require('http2');

const utils = require('./src/utils');
const meta = require('./package.json');
const SunacLegacyDatabase = require('./src/sequelize');
const normalize = require('./src/normalize');
const wechat = require('./src/wechat');
const ShareLikeCache = require('./src/shareLike');

module.exports = Duck({
	id: 'com.sunac.legacy',
	name: meta.name,
	namespace: 'sl',
	components: [
		DuckLog(),
		DuckWorkspace(),
		DuckWeb([
			{
				id: 'legacy.administration',
				Application: require('./src/Application/Administration')
			},
			{
				id: 'legacy.maintenance',
				Application: require('./src/Application/Maintenance')
			},
			{
				id: 'legacy.customers',
				Application: require('./src/Application/Customers')
			},
			{
				id: 'common.redirect',
				Application: DuckWeb.Application.RedirectHttps
			}
		]),
	]
}, function SunacLegacy({
	injection, Web, Log, Workspace, product
}, options) {
	/**
	 * @type {import('./src/normalize/options').Options}
	 */
	const finalOptions = normalize(options);

	wechat.setApp(finalOptions.wx.appid, finalOptions.wx.appsecret);

	injection.options = finalOptions;
	injection.Utils = utils;

	Workspace.root = finalOptions.storage.path;
	Workspace.setPath('root', '');
	Workspace.setPath('log', finalOptions.log.path);
	Workspace.setPath('temp', 'tmp');
	Workspace.setPath('image', 'images');
	Workspace.setPath('wechat', 'wechat');

	const { sequelize, Model } = SunacLegacyDatabase({
		namespace: `${product.meta.namespace}_`,
		storage: Workspace.resolve('root', finalOptions.database.options.path),
	});

	injection.ShareLike = ShareLikeCache(sequelize, finalOptions.cityList);
	injection.Sequelize = sequelize;
	injection.Model = Model;
	injection.Wechat = {
		get accessToken() {
			return wechat.fetchAccessToken();
		},
		get jsSdkTicket() {
			return wechat.fetchJsSdkTicket();
		}
	};

	const Application = {
		Administration: Web.Application('legacy.administration'),
		Maintenance: Web.Application('legacy.maintenance'),
		Customers: Web.Application('legacy.customers')
	};

	const LogWrapedApp = {
		Administration: DuckLog.Adapter.HttpServer(Application.Administration, _ => Log.access(_)),
		Maintenance: DuckLog.Adapter.HttpServer(Application.Maintenance, _ => Log.access(_)),
		Customers: DuckLog.Adapter.HttpServer(Application.Customers, _ => Log.access(_)),
	};

	Log('system');
	Log('db');
	Log('wechat');
	Log('access', {
		AppenderList: [DuckLog.Appender.Console()],
		format: DuckLog.Format.ApacheCLF()
	});

	return Object.freeze({
		async start() {
			(async function computeShareLike() {
				await injection.ShareLike.compute();
				setTimeout(computeShareLike, 60000);
			}());

			await wechat.setDir(Workspace.getPath('wechat'));

			if (finalOptions.server.maintenance.tls === null) {
				const { host, port } = finalOptions.server.maintenance;

				http
					.createServer(LogWrapedApp.Maintenance)
					.listen(port, host);

				Log.system(`Starting: <Maintenance> on host="${host}", port=${port}`);
			}

			{
				const { host, port } = finalOptions.server.administration;

				http
					.createServer(LogWrapedApp.Administration)
					.listen(port, host);

				Log.system(`Starting: <Administration> on host="${host}", port=${port}`);
			}

			{
				const { host, port, origin } = finalOptions.server.customers;

				http
					.createServer(LogWrapedApp.Customers)
					.listen(port, host);

				Log.system(`Starting: <Customers> on host="${host}", port=${port}, origin=${origin}`);
			}
		},
		async install() {
			await Workspace.buildAll();
			await sequelize.sync({ force: true });

			const salt = utils.salt();

			await Model.Maintainer.create({
				id: utils.encodeSHA256(`${Date.now()}-root`),
				name: 'root',
				createdAt: new Date(),
				credential: {
					salt: salt,
					password: utils.encodeSHA256(`root${salt}`)
				}
			}, {
				include: 'credential',
			});
		},
		get sequelize() {
			return sequelize;
		}
	});
});
