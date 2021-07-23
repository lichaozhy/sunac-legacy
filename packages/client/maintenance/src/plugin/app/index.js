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
				return agent.delete('/principal').then(pickData);
			},
			Maintainer: {
				get() {
					return agent.get('/principal/maintainer').then(pickData);
				},
				update(options) {
					return agent.put('/principal/maintainer', {
						credential: {
							password: options.credential.password
						}
					}).then(pickData);
				}
			}
		},
		City: {

		},
		Maintainer: Object.assign(function Maintainer(maintainerId) {
			return {
				get() {
					return agent.get(`/maintainer/${maintainerId}`).then(pickData);
				},
				update(options) {
					return agent.put(`/maintainer/${maintainerId}`, {
						credential: {
							password: options.credential.password
						}
					}).then(pickData);
				},
				delete() {
					return agent.delete(`/maintainer/${maintainerId}`);
				}
			};
		}, {
			query() {
				return agent.get('/maintainer').then(pickData);
			},
			create(options) {
				return agent.post('/maintainer', {
					name: options.name,
					credential: {
						password: options.credential.password
					}
				}).then(pickData);
			}
		})
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
