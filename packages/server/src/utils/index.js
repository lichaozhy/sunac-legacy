const crypto = require('crypto');

module.exports = Object.freeze({
	City: require('./city'),
	encodeSHA256(raw) {
		return crypto
			.createHash('sha256')
			.update(raw)
			.digest()
			.toString('hex');
	},
	randomInt(from, to) {
		return Math.round(Math.random() * (to - from) + from);
	},
});
