const SunacLegacy = require('../packages/server');
const product = SunacLegacy({
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
