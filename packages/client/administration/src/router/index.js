import Vue from 'vue';
import VueRouter from 'vue-router';
import * as Page from '../pages';

Vue.use(VueRouter);

const router = new VueRouter({
	linkActiveClass: 'active',
	mode: 'hash',
	routes: [
		{
			path: '/',
			name: 'Home',
			redirect: { name: 'Workbench' }
		},
		{
			name: 'Workbench',
			path: '/workbench',
			redirect: { name: 'Workbench.Validation' },
			component: Page.Workbench.Framework,
			meta: { principalRequired: true },
			children: [
				{
					name: 'Workbench.Interaction',
					path: 'interaction',
					redirect: { name: 'Workbench.Interaction.Share' },
					component: Page.Workbench.Interaction.Framework,
					meta: { customerRequired: true },
					children: [
						{
							name: 'Workbench.Interaction.Share',
							path: 'share',
							component: Page.Workbench.Interaction.Share
						},
						{
							name: 'Workbench.Interaction.Post',
							path: 'post',
							component: Page.Workbench.Interaction.Post
						},
						{
							name: 'Workbench.Interaction.Topic',
							path: 'topic',
							component: Page.Workbench.Interaction.Topic
						}
					]
				},

				{
					name: 'Workbench.Validation',
					path: 'validation',
					redirect: { name: 'Workbench.Validation.Share' },
					component: Page.Workbench.Validation.Framework,
					children: [
						{
							name: 'Workbench.Validation.Post',
							path: 'post',
							component: Page.Workbench.Validation.Post
						},
						{
							name: 'Workbench.Validation.Share',
							path: 'share',
							component: Page.Workbench.Validation.Share
						},
						{
							name: 'Workbench.Validation.Topic',
							path: 'topic',
							component: Page.Workbench.Validation.Topic
						}
					]
				},

				{
					name: 'Workbench.Content',
					path: 'content',
					redirect: { name: 'Workbench.Content.Reference' },
					component: Page.Workbench.Content.Framework,
					children: [
						{
							name: 'Workbench.Content.Reference',
							path: 'overview',
							component: Page.Workbench.Content.Reference.Overview
						},
						{
							name: 'Workbench.Content.Photo',
							path: 'photo',
							component: Page.Workbench.Content.Photo.Overview
						}
					]
				},

				{
					name: 'Workbench.Setting',
					path: 'setting',
					component: Page.Workbench.Setting.Framework,
					redirect: { name: 'Workbench.Setting.Profile' },
					children: [
						{
							name: 'Workbench.Setting.Profile',
							path: 'profile',
							component: Page.Workbench.Setting.Profile
						}
					]
				}
			]
		},
		{
			name: 'Signin',
			path: '/signin',
			component: Page.Signin,
			meta: {
				noPrincipalRequired: true
			}
		}
	]
});

export default router;
