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
			Administrator: {
				get() {
					return agent.get('/principal/administrator').then(pickData);
				},
				update(options) {
					return agent.put('/principal/administrator', {
						credential: {
							_password: options.credential._password,
							password: options.credential.password
						}
					}).then(pickData);
				},
				Customer: {
					update(options) {
						return agent.put('/principal/administrator/customer', {
							id: options.id,
							cityAs: options.cityAs
						}).then(pickData);
					}
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
		Customer: Object.assign(function Customer(customerId) {
			return {
				get() {
					return agent.get(`/customer/${customerId}`).then(pickData);
				}
			};
		}, {
			query(query) {
				const params = {};

				if (query.name) {
					params.name = query.name;
				}

				return agent.get('/customer', { params }).then(pickData);
			}
		}),
		Photo: Object.assign(function Photo(photoId) {
			return {
				get() {
					return agent.get(`/photo/${photoId}`).then(pickData);
				},
				delete() {
					return agent.delete(`/photo/${photoId}`).then(pickData);
				}
			};
		}, {
			query(query) {
				const params = {};

				if (query.title) {
					params.title = query.title;
				}

				if ('pageCurrent' in query) {
					params.pageCurrent = query.pageCurrent;
				}

				if ('pageSize' in query) {
					params.pageSize = query.pageSize;
				}

				return agent.get('/photo', { params }).then(pickData);
			},
			create(options) {
				console.log(options);
				return agent.post('/photo', {
					title: options.title,
					image: options.image,
					city: options.city
				}).then(pickData);
			}
		}),
		Reference: Object.assign(function Reference(referenceId) {
			return {
				get() {
					return agent.get(`/reference/${referenceId}`).then(pickData);
				},
				delete() {
					return agent.delete(`/reference/${referenceId}`).then(pickData);
				},
			};
		}, {
			create(options) {
				return agent.post('/reference', {
					title: options.title,
					abstract: options.abstract,
					href: options.href,
					city: options.city,
					thumb: options.thumb
				}).then(pickData);
			},
			query(query) {
				const params = {};

				if (query.title) {
					params.title = query.title;
				}

				if ('pageCurrent' in query) {
					params.pageCurrent = query.pageCurrent;
				}

				if ('pageSize' in query) {
					params.pageSize = query.pageSize;
				}

				if ('sortBy' in query) {
					params.sortBy = query.sortBy || 'createdAt';
				}

				if ('sortDesc' in query) {
					params.sortDesc = query.sortDesc;
				}

				return agent.get('/reference', { params }).then(pickData);
			},
		}),
		Share: Object.assign(function Share(shareId) {
			return {
				get() {
					return agent.get(`/share/${shareId}`).then(pickData);
				},
				update(options) {
					// 可以修改自己的
					return agent.put(`/share/${shareId}`, {
						valid: options.valid,
						raw: options.raw,
						imageList: options.imageList
					}).then(pickData);
				},
				delete() {
					return agent.delete(`/share/${shareId}`).then(pickData);
				}
			};
		}, {
			create(options) {
				return agent.post('/share', {
					raw: options.raw,
					imageList: options.imageList
				}).then(pickData);
			},
			query() {
				return agent.get('/share').then(pickData);
			}
		}),
		Topic: Object.assign(function Topic(topicId) {
			return {
				get() {
					return agent.get(`/topic/${topicId}`).then(pickData);
				},
				update(options) {
					return agent.put(`/topic/${topicId}`, {
						title: options.title,
						banner: options.banner,
						description: options.description,
						valid: options.valid
					}).then(pickData);
				},
				delete() {
					return agent.delete(`/topic/${topicId}`).then(pickData);
				},
				Post: {
					create(options) {
						return agent.get(`/topic/${topicId}/post`, {
							raw: options.raw,
							imageList: options.imageList
						}).then(pickData);
					},
					query() {
						return agent.get(`/topic/${topicId}/post`).then(pickData);
					}
				}
			};
		}, {
			query() {
				return agent.get('/topic').then(pickData);
			},
			create(options) {
				return agent.post('/topic', {
					title: options.title,
					banner: options.banner,
					description: options.description
				}).then(pickData);
			},
			Post: Object.assign(function Post(postId) {
				return {
					get() {
						return agent.get(`/topic/post/${postId}`).then(pickData);
					},
					update(options) {
						return agent.put(`/topic/post/${postId}`, {
							raw: options.raw,
							imageList: options.imageList,
							valid: options.valid
						}).then(pickData);
					},
					delete() {
						return agent.delete(`/topic/post/${postId}`).then(pickData);
					}
				};
			}, {
				query() {
					return agent.get('/topic/post').then(pickData);
				}
			})
		}),
		Image: {
			create(options) {
				return agent.post('/image', options).then(pickData);
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
	}
};
