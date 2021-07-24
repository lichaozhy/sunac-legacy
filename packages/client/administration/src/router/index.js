import Vue from 'vue';
import VueRouter from 'vue-router';
import * as Page from '../pages';

Vue.use(VueRouter);

const routes = [
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
		}
	},
	{
		name: 'Signin',
		path: '/signin',
		component: Page.Signin,
		meta: {
			noPrincipalRequired: true
		}
	}
];

const router = new VueRouter({
	routes
});

export default router;
