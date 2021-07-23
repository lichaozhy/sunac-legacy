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
			redirect: { name: 'Workbench.Maintainer.Overview' },
			component: Page.Workbench.Framework,
			meta: {
				principalRequired: true
			},
			children: [
				{
					name: 'Workbench.Principal.Maintainer',
					path: 'principal/maintainer',
					component: Page.Workbench.Principal
				},

				{
					name: 'Workbench.Maintainer',
					path: 'maintainer',
					redirect: { name: 'Workbench.Maintainer.Overview' }
				},
				{
					name: 'Workbench.Maintainer.Overview',
					path: 'maintainer/overview',
					component: Page.Workbench.Maintainer.Overview
				},
				{
					name: 'Workbench.Maintainer.Creation',
					path: 'maintainer/creation',
					component: Page.Workbench.Maintainer.Creation
				},
				{
					name: 'Workbench.Maintainer.Detail',
					path: 'maintainer/:maintainerId/detail',
					component: Page.Workbench.Maintainer.Detail
				},

				{
					name: 'Workbench.Administrator',
					path: 'administrator',
					component: Page.Workbench.Administrator
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
