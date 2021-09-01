import Vue from 'vue';
import VueRouter from 'vue-router';

import * as Page from '../pages';

Vue.use(VueRouter);

const router = new VueRouter({
	linkActiveClass: 'active',
	mode: 'hash',
	routes: [
		{
			name: 'Home',
			path: '/home',
			redirect: { name: 'Home.Share.Overview' },
			component: Page.Home.Framework,
			children: [
				{
					name: 'Home.Share.Overview',
					path: 'share/overview',
					component: Page.Home.Share.Overview,
				},
				{
					name: 'Home.Share.Ranking',
					path: 'share/ranking',
					component: Page.Home.Share.Ranking
				},
				{
					name: 'Home.News',
					path: 'news',
					component: Page.Home.News
				},
				{
					name: 'Home.Rule',
					path: 'rule',
					component: Page.Home.Rule
				},
			],
			beforeEnter(_to, _from, next) {
				document.title = '城市记忆博物馆';
				next();
			}
		},

		{
			name: 'Share.Detail',
			path: '/share/:shareId/detail',
			component: Page.Home.Share.Detail,
			beforeEnter(_to, _from, next) {
				document.title = '非遗圈';
				next();
			}
		},

		{
			name: 'Photo',
			path: '/photo',
			component: Page.Photo.Overview,
			beforeEnter(_to, _from, next) {
				document.title = '活动相册';
				next();
			}
		},

		{
			name: 'Figure',
			path: '/figure',
			component: Page.Figure.Overview,
			beforeEnter(_to, _from, next) {
				document.title = '非遗传承人';
				next();
			}
		},

		{
			name: 'Radio',
			path: '/radio',
			component: Page.Radio.Overview,
			beforeEnter(_to, _from, next) {
				document.title = '往期电台';
				next();
			}
		},

		{
			name: 'Topic',
			path: '/topic',
			component: Page.Topic.Overview,
			beforeEnter(_to, _from, next) {
				document.title = '话题广场';
				next();
			}
		},
		{
			name: 'Topic.Detail',
			path: '/topic/:topicId/detail',
			component: Page.Topic.Detail,
			beforeEnter(_to, _from, next) {
				document.title = '话题动态';
				next();
			}
		},

		{
			name: 'Creation.Post',
			path: '/topic/:topicId/post/creation',
			component: Page.Creation.Post,
			beforeEnter(_to, _from, next) {
				document.title = '发布话题动态';
				next();
			}
		},
		{
			name: 'Creation.Share',
			path: '/share/creation',
			component: Page.Creation.Share,
			beforeEnter(_to, _from, next) {
				document.title = '发布非遗圈分享';
				next();
			}
		},
		{
			name: 'Creation.Topic',
			path: '/topic/creation',
			component: Page.Creation.Topic,
			beforeEnter(_to, _from, next) {
				document.title = '发布话题';
				next();
			}
		}
	]
});

export default router;
