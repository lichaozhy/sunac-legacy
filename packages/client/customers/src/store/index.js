import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		sharing: false,
		isLocationShow: false
	},
	mutations: {
		closeSharing(state) {
			state.sharing = false;
		},
		openShareing(state) {
			state.sharing = true;
		},

		closeLocation(state) {
			state.isLocationShow = false;
		},
		openLocation(state) {
			state.isLocationShow = true;
		}
	},
	actions: {
	},
	modules: {
	}
});
