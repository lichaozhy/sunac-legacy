import './customs.scss';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import AppPlugin from './plugin/app';

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import bvOptions from './bvOptions.json';

Vue.use(BootstrapVue, bvOptions);
Vue.use(BootstrapVueIcons);
Vue.use(AppPlugin);

Vue.config.productionTip = false;

/**
 * Trying to intercept a wrong route.
 *
 * @param {import('vue-router').Route} route
 */
async function go(route) {
	if (route.matched.find(match => match.meta.isDev)) {
		return;
	}

	const requiredPrincipal = {
		yes: route.matched.find(match => match.meta.principalRequired),
		no: route.matched.find(match => match.meta.noPrincipalRequired)
	};

	await store.dispatch('fetchPrincipal');
	const signedin = store.getters.hasPrincipal;

	if (route.matched.length === 0) {
		return { name: signedin ? 'Workbench' : 'Signin' };
	}

	if (signedin && requiredPrincipal.no) {
		return { name: 'Workbench' };
	}

	if (!signedin && requiredPrincipal.yes) {
		return { name: 'Signin' };
	}
}

const application = new Vue({ router, store, render: h => h(App) });

router.beforeEach(async function guard(to, _from, next) {
	next(await go(to));
});

window.addEventListener('load', async function bootstrap() {
	/**
	 * Installing router.
	 */
	const genesisHash = document.location.hash.substr(1);
	const { route } = router.resolve(genesisHash);
	const target = await go(route);

	if (target) {
		router.push(target);
	}

	application.$mount('#app');
});
