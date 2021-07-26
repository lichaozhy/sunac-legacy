import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		principal: {
			administratorId: null,
			customer: null
		}
	},
	getters: {
		hasPrincipal: state => state.principal.administratorId !== null,
		hasCustomer: state => state.principal.customer !== null
	},
	mutations: {
		setPrincipal(state, id) {
			state.principal.administratorId = id;
		},
		resetPrincipal(state) {
			state.principal.administratorId = null;
		},
		setCustomer(state, id) {
			state.principal.customer = id;
		}
	},
	actions: {
		async fetchPrincipal({ commit }) {
			try {
				const administrator = await Vue.$app.Api.Principal.Administrator.get();
				const { customer } = administrator;

				commit('setPrincipal', administrator.id);

				if (customer !== null) {
					commit('setCustomer', customer.id);
				}
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
