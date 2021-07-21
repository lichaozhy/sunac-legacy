const SunacLegacy = require('../packages/server');
const product = SunacLegacy({
	storage: {
		path: process.cwd()
	},
	log: {
		path: ''
	}
});

product.start();
