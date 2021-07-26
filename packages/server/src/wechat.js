const fs = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');

const config = {
	dirpath: '',
	access_token: {
		value: null,
		createdAt: new Date(0)
	},
	jsapi: {
		ticket: null,
		createdAt: new Date(0)
	},
	app: {
		id: '',
		secret: ''
	}
};

const FILE_NAME ={
	ACCESS_TOKEN: 'access_token.json',
	JS_SDK_TIEKCT: 'js_sdk_ticket.json'
};

const OPEN_WECHAT_JS_SDK_TICKET= 'https://api.weixin.qq.com/cgi-bin/ticket/getticket';
const OPEN_WECHAT_APP_TOKEN = 'https://api.weixin.qq.com/cgi-bin/token';

async function refreshToken() {
	const queryString = [
		'grant_type=client_credential',
		`appid=${config.app.id}`,
		`secret=${config.app.secret}`
	].join('&');

	const res = await fetch(`${OPEN_WECHAT_APP_TOKEN}?${queryString}`);
	const { access_token } = await res.json();
	const now = new Date();

	config.access_token.value = access_token;
	config.access_token.createdAt = now;

	const jsonOfAccessToken = JSON.stringify({ access_token, createdAt: now }, null, 2);

	await fs.writeFile(path.join(config.dirpath, FILE_NAME.ACCESS_TOKEN), jsonOfAccessToken);
}

async function refreshJsSdkTicket() {
	const queryString = [`access_token=${config.access_token.value}`, 'type=jsapi'].join('&');
	const res = await fetch(`${OPEN_WECHAT_JS_SDK_TICKET}?${queryString}`);
	const { ticket } = await res.json();
	const now = new Date();

	config.jsapi.ticket = ticket;
	config.jsapi.createdAt = now;

	const jsonOfJsSdkTicket = JSON.stringify({ ticket, createdAt: now }, null, 2);

	await fs.writeFile(path.join(config.dirpath, FILE_NAME.JS_SDK_TIEKCT), jsonOfJsSdkTicket);
}

// 如果没有主动观察，可能会失效
// 一次失败就续上了

const wechat = {
	fetchAccessToken() {
		if (new Date() - config.access_token.createdAt > 3600) {
			refreshToken();
		}

		return config.access_token.value;
	},
	fetchJsSdkTicket() {
		if (new Date() - config.jsapi.createdAt > 3600) {
			refreshJsSdkTicket();
		}

		return config.jsapi.ticket;
	},
	async setDir(pathname) {
		config.dirpath = pathname;

		const pathOfAccessToken = path.join(config.dirpath, FILE_NAME.ACCESS_TOKEN);
		const pathOfJsSdkTicket = path.join(config.dirpath, FILE_NAME.JS_SDK_TIEKCT);

		await fs.ensureFile(pathOfAccessToken);
		await fs.ensureFile(pathOfJsSdkTicket);

		try {
			const { access_token, createdAt } = await fs.readJSON(pathOfAccessToken);

			config.access_token.value = access_token;
			config.access_token.createdAt = new Date(createdAt);
			wechat.fetchAccessToken();
		} catch (err) {
			await refreshToken();
		}

		try {
			const { ticket, createdAt } = await fs.readJSON(pathOfJsSdkTicket);

			config.jsapi.ticket = ticket;
			config.jsapi.createdAt = new Date(createdAt);
			wechat.fetchJsSdkTicket();
		} catch (err) {
			await refreshJsSdkTicket();
		}
	},
	setApp(id, secret) {
		config.app.id = id;
		config.app.secret = secret;
	}
};

module.exports = wechat;
