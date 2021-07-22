import Vue from 'vue';
import VueRouter from 'vue-router';
import * as Page from '../pages';

Vue.use(VueRouter);

const router = new VueRouter({
	routes: [
		{
			path: '/',
			name: 'Home',
			redirect: {
				name: 'workbench'
			}
		},
		{
			name: 'workbench',
			path: '/workbench'
		},
		{
			name: 'signin',
			path: '/signin',
			component: Page.Signin
		}
	]
});

export default router;
