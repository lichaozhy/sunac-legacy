const SunacLegacy = require('../packages/server');
const product = SunacLegacy({
	server: {
		customers: {
			dev: false,
			origin: 'http://127.0.0.1',
			port: 8000
		}
	},
	storage: {
		path: process.cwd()
	},
	log: {
		path: ''
	},
	wx: {
		appid: 'wx2f42fa22df4a7b9c',
		appsecret: '0a3a9d3753c0585e87eb602277c597c6'
	}
});

product.start();
