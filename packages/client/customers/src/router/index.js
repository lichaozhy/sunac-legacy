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
					component: Page.Home.Share.Overview
				},
				{
					name: 'Home.Share.Ranking',
					path: 'share/ranking',
					component: Page.Home.Share.Ranking
				},
			]
		},

		{
			name: 'Share.Detail',
			path: '/share/:shareId/detail',
			component: Page.Home.Share.Detail
		},

		{
			name: 'Photo',
			path: '/photo',
			component: Page.Photo.Overview
		},

		{
			name: 'Figure',
			path: '/figure',
			component: Page.Figure.Overview
		},

		{
			name: 'Location',
			path: '/location',
			component: Page.Location.Selector
		},

		{
			name: 'Reference',
			path: '/reference',
			component: Page.Reference.Overview
		},

		{
			name: 'Topic',
			path: '/topic',
			component: Page.Topic.Overview
		},
		{
			name: 'Topic.Detail',
			path: '/topic/:topicId/detail',
			component: Page.Topic.Detail
		},
		{
			name: 'Topic.Post',
			path: '/topic/:topicId/post/:postId',
			component: Page.Topic.Post
		},

		{
			name: 'Creation.Post',
			path: '/topic/:topicId/post/creation',
			component: Page.Creation.Post
		},
		{
			name: 'Creation.Share',
			path: '/share/creation',
			component: Page.Creation.Share
		},
		{
			name: 'Creation.Topic',
			path: '/topic/creation',
			component: Page.Creation.Topic
		}
	]
});

export default router;
