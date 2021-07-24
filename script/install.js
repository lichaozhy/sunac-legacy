const SunacLegacy = require('../packages/server');
const product = SunacLegacy({
	storage: {
		path: process.cwd()
	},
	log: {
		path: ''
	},
	wx: {
		appid: '',
		appsecret: ''
	}
});

(async function debugInstall() {
	await product.install();
}());
