const fs = require('fs');
const path = require('path');

const SunacLegacy = require('../packages/server');
const wechat = require('../config/wechat.json');

module.exports = SunacLegacy({
	server: {
		customers: {
			dev: false,
			origin: 'https://legacy.4009971918.com',
			port: 443,
			tls: {
				key: fs.readFileSync(path.resolve('config/legacy.4009971918.com.key')),
				cert: fs.readFileSync(path.resolve('config/legacy.4009971918.com.pem'))
			}
		},
	},
	storage: {
		path: path.resolve('production')
	},
	log: {
		path: ''
	},
	wx: {
		appid: wechat.appid,
		appsecret: wechat.appsecret,
		debug: false
	},
	cityList: [
		'310000', '320500', '320600', '320200', '320400',
		'321000', '321100', '321200', '340200', '320100',
		'341100', '340500', '320300', '320800', '321300',
		'340400', '320900', '150100', '150200', '650000',
		'150000'
	],
	defaultCity: '310000'
});
