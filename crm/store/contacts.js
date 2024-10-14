import variables from './variables';

const { BASE_API_URL } = variables;

const state = () => ({
    contacts: [], // array of leads
});

const getters = {
    getContacts: state => state.contacts
};

const mutations = {
    setContacts(state, contacts) {
        state.contacts = contacts;
    },
}

const actions = {
    async fetchContacts({ commit }) {
        const response = await fetch(`${BASE_API_URL}/contacts`);
        const contacts = await response.json();
        commit('setContacts', contacts);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}