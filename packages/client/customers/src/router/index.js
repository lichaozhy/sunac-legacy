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
			redirect: { name: 'Home.Overview' },
			component: Page.Home.Framework,
			children: [
				{
					name: 'Home.Overview',
					path: 'overview',
					component: Page.Home.Overview
				},
				{
					name: 'Home.Photo',
					path: 'photo',
					component: Page.Home.Photo.Overview
				},

				{
					name: 'Home.Share',
					path: 'share',
					component: Page.Home.Share.Overview
				},
				{
					name: 'Home.Share.Detail',
					path: 'share/:shareId/detail'
				},
			]
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
			path: '/creation/post',
			component: Page.Creation.Post
		},
		{
			name: 'Creation.Share',
			path: '/creation/share',
			component: Page.Creation.Share
		},
		{
			name: 'Creation.Topic',
			path: '/creation/topic',
			component: Page.Creation.Topic
		}
	]
});

export default router;
