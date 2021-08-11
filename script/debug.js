const SunacLegacy = require('../packages/server');
const product = SunacLegacy({
	server: {
		customers: {
			dev: false,
			origin: 'http://192.168.43.208',
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
	}
});

product.start();
