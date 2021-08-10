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
					cityAs: options.cityAs,
					phone: options.phone
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
			query(query) {
				const params = {};

				if ('from' in query) {
					params.from = query.from;
				}

				if (query.size) {
					params.size = query.size;
				}

				if (query.city) {
					params.city = query.city;
				}

				if (query.createdAt) {
					params.createdAt = query.createdAt;
				}

				return agent.get('/photo', {params}).then(pickData);
			}
		}),
		Reference: {
			query(query) {
				const params = {};

				if (query.from) {
					params.from = query.from;
				}

				if (query.size) {
					params.size = query.size;
				}

				return agent.get('/reference', { params }).then(pickData);
			}
		},
		Share: Object.assign(function Share(shareId) {
			return {
				get() {
					return agent.get(`/share/${shareId}`).then(pickData);
				},
				like() {
					return agent.post(`/share/${shareId}/like`).then(pickData);
				},
				unlike() {
					return agent.delete(`/share/${shareId}/like`).then(pickData);
				}
			};
		}, {
			top(query) {
				const params = {};

				if (query.number <= 20) {
					params.number = query.number;
				}

				return agent.get('/share/top', { params }).then(pickData);
			},
			query(query) {
				const params = {};

				if ('from' in query) {
					params.from = query.from;
				}

				if (query.size) {
					params.size = query.size;
				}

				if (query.createdAt) {
					params.createdAt = query.createdAt;
				}

				return agent.get('/share', { params }).then(pickData);
			},
			create(options) {
				return agent.post('/share', {
					title: options.title,
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
							return agent.post(`/topic/${topicId}/post/${postId}/like`).then(pickData);
						},
						Reply: {
							query(query) {
								const params = {};

								if (typeof query.top === 'number') {
									params.top = query.top;
								}

								return agent.get(`/topic/${topicId}/post/${postId}/reply`, {
									params
								}).then(pickData);
							},
							create(options) {
								return agent.post(`/topic/${topicId}/post/${postId}/reply`, {
									raw: options.raw,
									post: options.post
								});
							}
						}
					};
				}, {
					query(query) {
						const params = {};

						if ('from' in query) {
							params.from = query.from;
						}

						if ('hot' in query) {
							params.hot = Boolean(query.hot);
						}

						if ('last' in query) {
							params.last = Boolean(query.last);
						}

						if (query.size) {
							params.size = query.size;
						}

						if (query.createdAt) {
							params.createdAt = query.createdAt;
						}

						return agent.get(`/topic/${topicId}/post`, { params }).then(pickData);
					},
					create(options) {
						return agent.post(`/topic/${topicId}/post`, {
							topicId,
							raw: options.raw,
							imageList: options.imageList
						}).then(pickData);
					}
				})
			};
		}, {
			query(query) {
				const params = {};

				if ('from' in query) {
					params.from = query.from;
				}

				if ('hot' in query) {
					params.hot = Boolean(query.hot);
				}

				if ('prize' in query) {
					params.prize = Boolean(query.prize);
				}

				if ('last' in query) {
					params.last = Boolean(query.last);
				}

				if (query.size) {
					params.size = query.size;
				}

				if (query.createdAt) {
					params.createdAt = query.createdAt;
				}

				return agent.get('/topic', { params }).then(pickData);
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
		},
		Image: {
			create(options) {
				return agent.post('/image', {
					mediaId: options.mediaId
				}).then(pickData);
			}
		},
		Figure: {
			query() {
				return agent.get('/figure').then(pickData);
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
