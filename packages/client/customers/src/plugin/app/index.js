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
		Banner: {
			query() {
				return agent.get('/banner').then(pickData);
			}
		},
		Customer: {
			get() {
				return agent.get('/customer').then(pickData);
			},
			update(options) {
				return agent.put('/customer', {
					city: options.city
				}).then(pickData);
			},
			TodayLiked: {
				query() {
					return agent.get('/customer/today/like').then(pickData);
				}
			},
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
		Photo: Object.assign(function Photo(photoId) {
			return {
				like() {
					return agent.post(`/photo/${photoId}/like`).then(pickData);
				}
			};
		}, {
			query() {
				return agent.get('/photo').then(pickData);
			}
		}),
		Reference: {
			query() {

			}
		},
		Share: Object.assign(function Share(shareId) {
			return {
				like() {
					return agent.post(`/share/${shareId}/like`).then(pickData);
				}
			};
		}, {
			query() {
				return agent.get('/share').then(pickData);
			},
			create(options) {
				return agent.post('/share', {
					raw: options.raw,
					imageList: options.imageList
				}).then(pickData);
			}
		}),
		Topic: Object.assign(function Topic(topicId) {
			return {
				get() {
					return agent.get(`/topic/${topicId}`).then(pickData);
				},
				delete() {
					return agent.delete(`/topic/${topicId}`).then(pickData);
				},
				like() {
					return agent.post(`/topic/${topicId}/like`).then(pickData);
				},
				Post: Object.assign(function Post(postId) {
					return {
						get() {
							return agent.get(`/topic/${topicId}/post/${postId}`).then(pickData);
						},
						delete() {
							return agent.delete(`/topic/${topicId}/post/${postId}`).then(pickData);
						},
						like() {
							return agent.post(`/topic/${topicId}/post/${postId}`).then(pickData);
						}
					};
				}, {
					query() {
						return agent.get(`/topic/${topicId}/post`).then(pickData);
					},
					create(options) {
						return agent.post(`/topic/${topicId}/post`, {
							raw: options.raw,
							imageList: options.imageList
						}).then(pickData);
					}
				})
			};
		}, {
			query() {
				return agent.get('/topic').then(pickData);
			},
			create(options) {
				return agent.post('/topic', {
					title: options.title,
					banner: options.banner,
					description: options.description,
				}).then(pickData);
			}
		}),
		Wechat: {
			getConfig() {
				return agent.get('/wechat/jssdk/config').then(pickData);
			}
		}
	},
	Filter: {
		localDate,
		localDatetime,
		localTime
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
		Vue.prototype.$wx = Vue.$wx = {
			chooseImage(options) {
				wx.chooseImage(options);
			},
			uploadImage(options) {
				wx.uploadImage(options);
			},
			updateAppMessageShareData(options) {
				wx.updateAppMessageShareData(options);
			},
			updateTimelineShareData(options) {
				wx.updateTimelineShareData(options);
			},
			promises: {
				chooseImage(options) {
					return new Promise((resolve) => {
						options.success = res => resolve(res);
						wx.chooseImage(options);
					});
				},
				uploadImage(options) {
					return new Promise((resolve) => {
						options.success = res => resolve(res);
						wx.uploadImage(options);
					});
				},
				updateAppMessageShareData(options) {
					return new Promise((resolve) => {
						options.success = () => resolve();
						wx.updateAppMessageShareData(options);
					});
				},
				updateTimelineShareData(options) {
					return new Promise((resolve) => {
						options.success = () => resolve();
						wx.updateTimelineShareData(options);
					});
				},
			}
		};
	}
};
