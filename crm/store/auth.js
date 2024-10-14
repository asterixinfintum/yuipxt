import variables from './variables';

const { BASE_API_URL } = variables;

export const state = () => ({
    admin: null,
    admin_token: null
});

export const mutations = {
  SET_ADMIN(state, data) {
    state.admin = data;
  },
  SET_ADMIN_TOKEN(state, data) {
    state.admin_token = data;
  }
}

export const actions = {
  async login({ commit }, formData) {
    return new Promise((resolve, reject) => {
      try {
        fetch(`${BASE_API_URL}/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
          const { adminData, token } = data
          localStorage.setItem('873__jh6bdjkadmtoken', token);
          commit('SET_ADMIN', adminData)
          commit('SET_ADMIN_TOKEN', token)
          resolve(data);
        })
        .catch(err => {
            reject(err)
        })
      } catch (error) {
        console.log(error)
      }
    });
  },

  async getCurrentAdmin({ commit }, adminId) {
    const admin_token = localStorage.getItem('873__jh6bdjkadmtoken');

    return new Promise((resolve, reject) => {
      try {
        fetch(`${BASE_API_URL}/admin?admin_id=${adminId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${admin_token}`
          }
        })
        .then(response => response.json())
        .then(data => {
          const { adminData, token } = data
          commit('SET_ADMIN', adminData);
          commit('SET_ADMIN_TOKEN', token);
          resolve(token);
        })
        .catch(err => {
          reject(err)
        })
      } catch (error) {
        console.log(error)
      }
    })
  }
}