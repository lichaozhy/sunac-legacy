const SunacLegacy = require('../packages/server');

module.exports = SunacLegacy({
	server: {
		customers: {
			dev: false,
			origin: 'http://127.0.0.1',
			port: 8000
		}
	},
	log: {
		path: ''
	},
	wx: {
		appid: 'wx2f42fa22df4a7b9c',
		appsecret: '0a3a9d3753c0585e87eb602277c597c6',
		debug: true
	},
	cityList: [
		'310000', '320500', '320600', '320200', '320400',
		'321000', '321100', '321200', '340200', '320100',
		'341100', '340500', '320300', '320800', '321300',
		'340400', '320900', '150100', '150200', '650000',
		'150000'
	],
});
