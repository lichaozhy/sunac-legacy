const SunacLegacy = require('../packages/server');
const product = SunacLegacy({
	wx: {
		appid: '',
		appsecret: ''
	}
});

(async function debugInstall() {
	await product.install();
}());
