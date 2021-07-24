const crypto = require('crypto');

const OPEN_WEIXIN_OAUTH2 = 'https://open.weixin.qq.com/connect/oauth2/authorize';

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
	salt(length = 8) {
		return Math.random().toString(16).substr(2, length);
	},
	WechatOauthRedirectURL({ appid, origin, scope = 'snsapi_base', state = '' }) {
		const queryList = [
			`appid=${appid}`,
			`redirect_uri=${encodeURIComponent(`${origin}/api/oauth/wechat`)}`,
			'response_type=code',
			`scope=${scope}`,
			`state=${state}`
		];

		return `${OPEN_WEIXIN_OAUTH2}?${queryList.join('&')}#wechat_redirect`;
	}
});
