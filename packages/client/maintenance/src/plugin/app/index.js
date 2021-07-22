import axios from 'axios';
import dateformat from 'dateformat';

const pickData = res => res.data;

export function localDatetime(value) {
	return dateformat(value, 'yyyy-mm-dd HH:MM:ss');
}

export function localDate(value) {
	return dateformat(value, 'yyyy-mm-dd');
}

export function localTime(value) {
	return dateformat(value, 'HH:MM:ss');
}

const agent = axios.create({ baseURL: '/api' });

const app = {
	Api: {
		Principal: {
			signin(options) {
				return agent.post('/principal', {
					username: options.username,
					password: options.password
				}).then(pickData);
			},
			signout() {
				return agent.delete('/pricipal').then(pickData);
			},
			Maintainer: {
				get() {
					return agent.get('/principal/maintainer').then(pickData);
				}
			}
		}
	}
};

export default {
	/**
	 * @param {import('vue/types/vue').VueConstructor} Vue
	 */
	install(Vue) {
		Vue.filter('localDatetime', localDatetime);
		Vue.filter('localDate', localDate);
		Vue.filter('localTime', localTime);

		Vue.prototype.$app = Vue.$app = app;
	}
};
