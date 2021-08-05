import './customs.scss';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import AppPlugin from './plugin/app';

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import bvOptions from './bvOptions.json';
import AppSharingMask from './components/SharingMask.vue';

Vue.use(BootstrapVue, bvOptions);
Vue.use(BootstrapVueIcons);
Vue.use(AppPlugin);

Vue.component('app-sharing-mask', AppSharingMask);

Vue.config.productionTip = false;

const application = new Vue({ router, store, render: h => h(App) });

/**
 * Trying to intercept a wrong route.
 *
 * @param {import('vue-router').Route} route
 */
async function go(route) {
	if (route.matched.find(match => match.meta.isDev)) {
		return;
	}

	if (route.matched.length === 0) {
		return { name: 'Home' };
	}
}

router.beforeEach(async function guard(to, _from, next) {
	next(await go(to));
});

window.addEventListener('load', async function bootstrap() {
	const script = this.document.createElement('script');

	script.src = '//res.wx.qq.com/open/js/jweixin-1.6.0.js';

	script.addEventListener('load', async function configWechat() {
		const config = await Vue.$app.Api.Wechat.getConfig();

		wx.config({
			debug: config.debug,
			appId: config.appId,
			timestamp: config.timestamp,
			nonceStr: config.nonceStr,
			signature: config.signature,
			jsApiList: [
				'chooseImage',
				'uploadImage',
				'updateAppMessageShareData',
				'updateTimelineShareData',
				'getLocalImgData'
			]
		});

		wx.ready(async function mountApplication() {
			const genesisHash = document.location.hash.substr(1);
			const { route } = router.resolve(genesisHash);
			const target = await go(route);

			if (target) {
				router.push(target);
			}

			application.$mount('#app');
		});
	});

	this.document.head.appendChild(script);
});
