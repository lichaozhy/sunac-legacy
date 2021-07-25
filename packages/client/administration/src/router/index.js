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
					redirect: { name: 'Workbench.Interaction.Topic' },
					component: Page.Workbench.Interaction.Framework,
					meta: { customerRequired: true },
					children: [
						{
							name: 'Workbench.Interaction.Post',
							path: 'post',
							component: Page.Workbench.Interaction.Post
						},
						{
							name: 'Workbench.Interaction.Reference',
							path: 'comment',
							component: Page.Workbench.Interaction.Reference
						},
						{
							name: 'Workbench.Interaction.Comment',
							path: 'comment',
							component: Page.Workbench.Interaction.Comment
						},
						{
							name: 'Workbench.Interaction.Share',
							path: 'share',
							component: Page.Workbench.Interaction.Share
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
					redirect: { name: 'Workbench.Validation.Comment' },
					component: Page.Workbench.Validation.Framework,
					children: [
						{
							name: 'Workbench.Validation.Post',
							path: 'post',
							component: Page.Workbench.Validation.Post
						},
						{
							name: 'Workbench.Validation.Comment',
							path: 'comment',
							component: Page.Workbench.Validation.Comment
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
					name: 'Workbench.Album',
					path: 'album',
					redirect: { name: 'Workbench.Album.Overview' },
					component: Page.Workbench.Album.Framework,
					children: [
						{
							name: 'Workbench.Album.Overview',
							path: 'overview',
							component: Page.Workbench.Album.Overview
						},
						{
							name: 'Workbench.Album.Creation',
							path: 'create',
							component: Page.Workbench.Album.Creation
						}
					]
				},

				{
					name: 'Workbench.Profile',
					path: 'profile',
					component: Page.Workbench.Profile
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
