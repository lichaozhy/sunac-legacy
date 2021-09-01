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
		Config: {
			get(key) {
				return agent.get(`/config/${key}`).then(pickData);
			},
			set(key, value) {
				return agent.put(`/config/${key}`, { value }).then(pickData);
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

				if ('city' in query) {
					params.city = query.city;
				}

				return agent.get('/photo', { params }).then(pickData);
			},
			create(options) {
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

				if ('city' in query) {
					params.city = query.city;
				}

				return agent.get('/reference', { params }).then(pickData);
			},
		}),
		News: Object.assign(function News(newsId) {
			return {
				get() {
					return agent.get(`/news/${newsId}`).then(pickData);
				},
				delete() {
					return agent.delete(`/news/${newsId}`).then(pickData);
				},
			};
		}, {
			create(options) {
				return agent.post('/news', {
					title: options.title,
					href: options.href,
					thumb: options.thumb,
					publishedAt: options.publishedAt
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

				return agent.get('/news', { params }).then(pickData);
			},
		}),
		Programme: Object.assign(function Programme(newsId) {
			return {
				get() {
					return agent.get(`/programme/${newsId}`).then(pickData);
				},
				delete() {
					return agent.delete(`/programme/${newsId}`).then(pickData);
				},
			};
		}, {
			create(options) {
				return agent.post('/programme', {
					title: options.title,
					href: options.href,
					thumb: options.thumb,
					publishedAt: options.publishedAt
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

				return agent.get('/programme', { params }).then(pickData);
			},
		}),
		Share: Object.assign(function Share(shareId) {
			return {
				get() {
					return agent.get(`/share/${shareId}`).then(pickData);
				},
				update() {
					return agent.put(`/share/${shareId}`).then(pickData);
				},
				delete() {
					return agent.delete(`/share/${shareId}`).then(pickData);
				}
			};
		}, {
			create(options) {
				return agent.post('/share', {
					title: options.title,
					city: options.city,
					raw: options.raw,
					imageList: options.imageList
				}).then(pickData);
			},
			query(query) {
				const params = {};

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

				if ('city' in query) {
					params.city = query.city;
				}

				if ('validated' in query) {
					params.validated = query.validated;
				}

				return agent.get('/share', { params }).then(pickData);
			}
		}),
		Topic: Object.assign(function Topic(topicId) {
			return {
				get() {
					return agent.get(`/topic/${topicId}`).then(pickData);
				},
				update() {
					return agent.put(`/topic/${topicId}`).then(pickData);
				},
				delete() {
					return agent.delete(`/topic/${topicId}`).then(pickData);
				},
				Prize: {
					create() {
						return agent.post(`/topic/${topicId}/prize`).then(pickData);
					},
					delete() {
						return agent.delete(`/topic/${topicId}/prize`).then(pickData);
					}
				},
				Post: Object.assign(function Post(postId) {
					return {
						get() {
							return agent.get(`/topic/${topicId}/post/${postId}`).then(pickData);
						},
						update() {
							return agent.put(`/topic/${topicId}/post/${postId}`).then(pickData);
						},
						delete() {
							return agent.delete(`/topic/${topicId}/post/${postId}`).then(pickData);
						}
					};
				}, {
					query() {
						return agent.get(`/topic/${topicId}/post`).then(pickData);
					},
					create(options) {
						return agent.post(`/topic/${topicId}/post`, {
							topic: topicId,
							raw: options.raw,
							imageList: options.imageList
						}).then(pickData);
					}
				})
			};
		}, {
			query(query) {
				const params = {};

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

				if ('city' in query) {
					params.city = query.city;
				}

				if ('validated' in query) {
					params.validated = query.validated;
				}

				if ('title' in query) {
					params.title = query.title;
				}

				if ('prize' in query) {
					params.prize = query.prize;
				}

				return agent.get('/topic', { params }).then(pickData);
			},
			create(options) {
				return agent.post('/topic', {
					title: options.title,
					banner: options.banner,
					city: options.city,
					description: options.description
				}).then(pickData);
			}
		}),
		Image: {
			create(options) {
				return agent.post('/image', options).then(pickData);
			}
		},
		Banner: Object.assign(function Banner(bannerId) {
			return {
				delete() {
					return agent.delete(`/banner/${bannerId}`).then(pickData);
				}
			};
		}, {
			create(options) {
				return agent.post('/banner', {
					image: options.image,
					city: options.city
				}).then(pickData);
			},
			query(query) {
				const params = {};

				if ('city' in query) {
					params.city = query.city;
				}

				return agent.get('/banner', { params }).then(pickData);
			}
		}),
		Figure: Object.assign(function Figure(figureId) {
			return {
				get() {
					return agent.get(`/figure/${figureId}`).then(pickData);
				},
				delete() {
					return agent.delete(`/figure/${figureId}`).then(pickData);
				}
			};
		}, {
			create(options) {
				return agent.post('/figure', {
					image: options.image,
					name: options.name,
					profile: options.profile,
					href: options.href
				}).then(pickData);
			},
			query() {
				return agent.get('/figure').then(pickData);
			}
		})
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
