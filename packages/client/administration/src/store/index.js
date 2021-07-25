import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		principal: {
			administratorId: null
		}
	},
	getters: {
		hasPrincipal: state => state.principal.administratorId !== null,
	},
	mutations: {
		setPrincipal(state, id) {
			state.principal.administratorId = id;
		},
		resetPrincipal(state) {
			state.principal.administratorId = null;
		},
	},
	actions: {
		async fetchPrincipal({ commit }) {
			try {
				const administrator = await Vue.$app.Api.Principal.Administrator.get();

				commit('setPrincipal', administrator.id);
			} catch (err) {
				console.log('Fetching principal failed.');
				commit('resetPrincipal');
			}
		},
		async signin({ dispatch }, payload) {
			await Vue.$app.Api.Principal.signin({
				username: payload.username,
				password: payload.password
			});

			await dispatch('fetchPrincipal');
		},
		async signout({ dispatch }) {
			await Vue.$app.Api.Principal.signout();
			await dispatch('fetchPrincipal');
		}
	},
	modules: {
	}
});
