import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		sharing: false
	},
	mutations: {
		closeSharing(state) {
			state.sharing = false;
		},
		openShareing(state) {
			state.sharing = true;
		}
	},
	actions: {
	},
	modules: {
	}
});
