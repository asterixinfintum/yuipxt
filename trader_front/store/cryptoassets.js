import BASE_VARS from './base_vars';

const { BASE_URL } = BASE_VARS;

export const state = () => ({
    cryptoassets: [],
    sellorders: [],
    buyorders: []
});

export const mutations = {
    SET_CRYPTOASSETS(state, data) {
        state.cryptoassets = data;
    },
    SET_SELLORDERS(state, data) {
        state.sellorders = data;
    },
    SET_BUYORDERS(state, data) {
        state.buyorders = data;
    },
}

export const actions = {
    async getcryptoassets({ commit }) {
        try { 
            fetch(`${BASE_URL}/assets/crypto`)
                .then(response => response.json())
                .then(data => {
                    const { cryptoAssets } = data;
                    commit('SET_CRYPTOASSETS', cryptoAssets);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.log(error)
        }
    }
}