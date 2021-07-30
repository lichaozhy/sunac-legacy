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

			}
		},
		Customer: {
			get() {

			},
			update() {

			},
			TodayLiked: {
				query() {

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
		Photo: Object.assign(function Photo() {
			return {
				like() {

				}
			};
		}, {
			query() {

			}
		}),
		Reference: {
			query() {

			}
		},
		Share: Object.assign(function Share() {
			return {
				like() {

				}
			};
		}, {
			query() {

			},
			create() {

			}
		}),
		Topic: Object.assign(function Topic() {
			return {
				get() {

				},
				delete() {

				},
				like() {

				},
				Post: Object.assign(function Post() {
					return {
						get() {

						},
						delete() {

						},
						like() {

						}
					};
				}, {
					query() {

					},
					create() {

					}
				})
			};
		}, {
			query() {

			},
			create() {

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
