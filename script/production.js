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
	}
});
