const Duck = require('@produck/duck');
const DuckWeb = require('@produck/duck-web');
const DuckLog = require('@produck/duck-log');
const DuckWorkspace = require('@produck/duck-workspace');
const http = require('http');
const https = require('https');

const meta = require('./package.json');

module.exports = Duck({
	id: 'com.sunac.legacy',
	name: meta.name,
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
	injection, Web, Log, Workspace
}, options) {

	return Object.freeze({
		start() {

		},
		install() {

		},
		get sequelize() {

		}
	});
});
