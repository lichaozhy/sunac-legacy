import axios from 'axios';
import dateformat from 'dateformat';

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
const pickData = res => res.data;

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
							_password: options.credential._password,
							password: options.credential.password
						}
					}).then(pickData);
				}
			}
		},
		City: Object.assign(function City(adcode) {
			return {
				get() {
					return agent.get(`/city/${adcode}`).then(pickData);
				}
			};
		}, {
			query() {
				return agent.get('/city').then(pickData);
			},
		}),
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
			query(query = {}) {
				return agent.get('/maintainer', {
					params: {
						name: query.name
					}
				}).then(pickData);
			},
			create(options) {
				return agent.post('/maintainer', {
					name: options.name,
					credential: {
						password: options.credential.password
					}
				}).then(pickData);
			}
		}),
		Administrator: Object.assign(function Administrator(administratorId) {
			return {
				get() {
					return agent.get(`/administrator/${administratorId}`).then(pickData);
				},
				update(options) {
					return agent.put(`/administrator/${administratorId}`, {
						credential: {
							password: options.credential.password
						}
					}).then(pickData);
				},
				delete() {
					return agent.delete(`/administrator/${administratorId}`).then(pickData);
				},
				City: {
					create(options) {
						return agent.post(`/administrator/${administratorId}/city`, {
							administratorId,
							adcode: options.adcode
						}).then(pickData);
					},
					delete(adcode) {
						return agent.delete(`/administrator/${administratorId}/city/${adcode}`).then(pickData);
					}
				}
			};
		}, {
			query(query = {}) {
				return agent.get('/administrator', {
					params: {
						name: query.name
					}
				}).then(pickData);
			},
			create(options) {
				return agent.post('/administrator', {
					name: options.name,
					cityList: options.cityList,
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
