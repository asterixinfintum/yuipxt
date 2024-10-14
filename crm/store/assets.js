import variables from './variables';

const { BASE_API_URL } = variables;

export const state = () => ({
    items: [],
    item: null
});

export const mutations = {
    SET_ASSETS(state, data) {
        state.items = data;
    },
    SET_ASSET(state, data) {
        state.item = data;
    }
}

export const actions = {
    async getAssets({ commit }) {
        const admin_token = localStorage.getItem('873__jh6bdjkadmtoken');

        return new Promise((resolve, reject) => {
            try {
                fetch(`${BASE_API_URL}/inhouseassets`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${admin_token}`
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        const { assets } = data;
                        commit('SET_ASSETS', assets);
                    });
            } catch (error) {
                console.log(error)
            }
        })
    },
    getAsset({ commit }, assetid) {
        const admin_token = localStorage.getItem('873__jh6bdjkadmtoken');

        return new Promise((resolve, reject) => {
            try {
                fetch(`${BASE_API_URL}/inhouseasset?assetId=${assetid}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${admin_token}`
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        const { asset } = data;
                        commit('SET_ASSET', asset);
                    });
            } catch (error) {
                console.log(error)
            }
        })
    }
}