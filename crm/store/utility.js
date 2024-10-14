import variables from './variables';

const { BASE_API_URL } = variables;

// users.js - Vuex module for managing users

const state = () => ({
    users: []
});
  
const getters = {
    getUsers: state => state.users
};
  
const mutations = {
    setUsers(state, users) {
        state.users = users;
    }
};
  
const actions = {
    async getUsers({ commit }) {
        const response = await fetch(`${BASE_API_URL}/users`);
        const users = await response.json();
        //console.log(users);
        commit('setUsers', users)
    }
};
  
export default {
    state,
    getters,
    mutations,
    actions
};
  