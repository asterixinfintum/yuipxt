import variables from './variables';

const { BASE_API_URL, BASE_API_URL_TWO } = variables;

export const state = () => ({
    clients: [],
    client: null,
    client_files: []
});

export const mutations = {
    SET_CLIENTS(state, data) {
        state.clients = data;
    },
    SET_CLIENT(state, data) {
        state.client = data;
    },
    SET_CLIENT_FILES(state, data) {
        state.client_files = data;
    }
}

export const actions = {
    async getClients({ commit }, admin_token) {
        return new Promise((resolve, reject) => {
            try {
                fetch(`${BASE_API_URL}/getusers`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${admin_token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    const { users } = data;
                    commit('SET_CLIENTS', users);
                })
                .catch(err => {
                    console.log(err)
                })
            } catch (error) {
                console.log(error)
            }
        })
    },
    async getClient({ commit }, { client_id, admin_token }) {
        return new Promise((resolve, reject) => {
            try {
                fetch(`${BASE_API_URL}/getuser?client_id=${client_id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${admin_token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    const { user } = data;
                    commit('SET_CLIENT', user);
                    resolve(user)
                })
                .catch(err => {
                    console.log(err);
                    reject(err)
                })
            } catch (error) {
                console.log(error)
            }
        })
    },
    getClientVerificationMedia({ commit }, { client_id }) {
        return new Promise((resolve, reject) => {
            try {
                fetch(`${BASE_API_URL_TWO}/files`, {
                    method: 'GET',
                })
                .then(response => response.json())
                .then(data => {
                    const { files } = data;
                    const client_files = files.filter(file => file.clientIdentifier === client_id);
                    commit('SET_CLIENT_FILES', client_files);
                    resolve(client_files);
                })
                .catch(err => {
                    console.log(err);
                    reject(err)
                })
            } catch (error) {
                console.log(error)
            }
        })
    },
    editClient({ commit }, { formData, client_id, admin_token }) {
        return new Promise((resolve, reject) => {
            try {
                fetch(`${BASE_API_URL}/edituser?client_id=${client_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${admin_token}`
                    },
                    body: JSON.stringify(formData),
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data, 'client updated');
                    resolve(data)
                })
                .catch(err => {
                    console.log(err);
                    reject(err)
                })
            } catch (error) {
                console.log(error)
            }
        });
    }
}