import variables from './variables';

const { BASE_API_URL } = variables;

const state = () => ({
    leads: [], // array of leads
});

const getters = {
    getLeads: state => state.leads
};

const mutations = {
    setLeads(state, leads) {
        state.leads = leads;
    },
}

const actions = {
    // Fetch the list of leads from the server
    async fetchLeads({ commit }) {
      const response = await fetch(`${BASE_API_URL}/leads`);
      const leads = await response.json();
      commit('setLeads', leads);
    },

    // Create a new lead and add it to the state
    async createLead({ commit }, leadData) {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
      const lead = await response.json();
      commit('addLead', lead);
    },

    // Update an existing lead in the state
    async updateLead({ commit }, leadData) {
      const response = await fetch(`/api/leads/${leadData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
      const lead = await response.json();
      commit('updateLead', lead);
    },

    // Delete an existing lead from the state
    async deleteLead({ commit }, id) {
      await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
      });
      commit('removeLead', id);
    },
  };

  export default {
    state,
    getters,
    mutations,
    actions
  }