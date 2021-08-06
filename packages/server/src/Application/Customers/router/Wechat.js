const { Router } = require('@produck/duck-web-koa-router');
const fetch = require('node-fetch');
const crypto = require('crypto');

const OPEN_WECHAT_ACCESS_TOKEN = 'https://api.weixin.qq.com/sns/oauth2/access_token';
const OPEN_WECHAT_USERINFO = 'https://api.weixin.qq.com/sns/userinfo';

const USERINFO_SCOPE_REG = /snsapi_userinfo/;

const StateHash = {
	photo(id) {
		return `/photo?preview=${id}`;
	},
	share(id) {
		return `/share/${id}/detail`;
	}
};

function resolveState(string) {
	try {
		const [type, id] = string.split('-');

		return `/api/wechat/share?shareType=${type}&shareItemId=${id}`;
	} catch (err) {
		return '/';
	}
}

module.exports = Router(function SunacLegacyApi(router, {
	options, Model, Log, Utils, Wechat
}) {
	async function requestOpenWechatAuthorization(code) {
		const queryString = [
			`appid=${options.wx.appid}`,
			`secret=${options.wx.appsecret}`,
			`code=${code}`,
			'grant_type=authorization_code'
		].join('&');

		const res = await fetch(`${OPEN_WECHAT_ACCESS_TOKEN}?${queryString}`);

		return res.json();
	}

	async function requestOpenWechatUserinfo(accessToken, openid) {
		const queryString = [
			`access_token=${accessToken}`,
			`openid=${openid}`,
			'lang=zh_CN'
		].join('&');

		const res = await fetch(`${OPEN_WECHAT_USERINFO}?${queryString}`);

		return res.json();
	}

	router
		.get('/oauth', async function getCodeForToken(ctx) {
			const { code, state } = ctx.query;

			if (!code) {
				return ctx.throw(400, 'Invalid oauth callback.');
			}

			const authorization = await requestOpenWechatAuthorization(code);

			if ('errcode' in authorization) {
				Log.wechat(JSON.stringify(authorization));

				return ctx.throw(400, 'Error occured on wechat authorization.');
			}

			const customer = await Model.Customer.findOne({
				include: [
					{
						model: Model.WechatOpenid,
						as: 'wechat',
						where: { openid: authorization.openid },
						required: true
					}
				]
			});

			if (!customer && !USERINFO_SCOPE_REG.test(authorization.scope)) {
				// oauth scope='snsapi_userinfo'
				const oauthURL = Utils.WechatOauthRedirectURL({
					appid: options.wx.appid,
					origin: options.server.customers.origin,
					scope: 'snsapi_userinfo',
					state
				});

				ctx.redirect(oauthURL);

				return;
			}

			if (customer) {
				// finding out customer
				ctx.session.customerId = customer.id;
			}

			if (USERINFO_SCOPE_REG.test(authorization.scope)) {
				// create new customer
				const { openid, access_token } = authorization;
				const userinfo = await requestOpenWechatUserinfo(access_token, openid);

				const customer = await Model.Customer.create({
					id: Utils.encodeSHA256(`${Date.now()}-${Utils.salt()}`),
					name: userinfo.nickname,
					cityAs: options.defaultCity,
					createdAt: new Date(),
					wechat: {
						openid: userinfo.openid,
						nickname: userinfo.nickname,
						sex: userinfo.sex,
						headimgurl: userinfo.headimgurl
					}
				}, {
					include: [
						{ model: Model.WechatOpenid, as: 'wechat' }
					]
				});

				ctx.session.customerId = customer.id;

				return ctx.redirect('/#/location');
			}

			ctx.redirect(state ? resolveState(state) : '/');
		})
		.get('/jssdk/config', async function generateConfig(ctx) {
			const config = {
				jsapi_ticket: Wechat.jsSdkTicket,
				noncestr: Utils.salt(),
				timestamp: Math.trunc(Date.now() / 1000),
				url: `${options.server.customers.origin}/`
			};

			const raw = [
				'jsapi_ticket','noncestr', 'timestamp', 'url'
			].map(key => `${key}=${config[key]}`).join('&');

			ctx.body = {
				debug: options.wx.debug,
				appId: options.wx.appid,
				timestamp: config.timestamp,
				nonceStr: config.noncestr,
				signature: crypto.createHash('sha1').update(raw).digest().toString('hex')
			};
		})
		.get('/share', async function redirectFromShare(ctx) {
			const { shareType, shareItemId } = ctx.query;

			if (!StateHash[shareType]) {
				return ctx.throw(400);
			}

			ctx.redirect(`/#${StateHash[shareType](shareItemId)}`);
		});
});
