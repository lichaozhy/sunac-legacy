import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		principal: {
			maintainerId: null
		}
	},
	getters: {
		hasPrincipal: state => state.principal.maintainerId !== null,
	},
	mutations: {
		setPrincipal(state, id) {
			state.principal.maintainerId = id;
		},
		resetPrincipal(state) {
			state.principal.maintainerId = null;
		},
	},
	actions: {
		async fetchPrincipal({ commit }) {
			try {
				const maintainer = await Vue.$app.Api.Principal.Maintainer.get();

				commit('setPrincipal', maintainer.id);
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
		}
	},
	modules: {
	}
});
