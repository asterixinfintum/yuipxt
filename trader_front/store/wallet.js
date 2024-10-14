import BASE_VARS from './base_vars';

const { BASE_URL } = BASE_VARS;

export const state = () => ({
    wallettypes: [],
    wallets: [],
    balances: [],
    walletassets: [],
    paginator: [],
    assetscategory: 'crypto'
});

export const mutations = {
    SET_WALLETTYPES(state, data) {
        state.wallettypes = data;
    },
    SET_WALLETS(state, data) {
        state.wallets = data;
    },
    SET_WALLETASSETS(state, data) {
        state.walletassets = data;
    },
    SET_WALLETASSETSPAGINATOR(state, data) {
        state.paginator = data;
    },
    SET_WALLETASSETSTCATEGORY(state, data) {
        state.assetscategory = data;
    }
}

export const actions = {
    async getwallets({ commit }) {
        try {
            const token = localStorage.getItem('873__jh6bdjktoken');
            const response = await fetch(`${BASE_URL}/wallets`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const { wllts } = data;
            commit('SET_WALLETS', wllts);

            return data;
        } catch (error) {
            throw error; // Rethrowing the error to be handled by the caller
        }
    },
    async getwalletsassets({ commit }, { wallettype, assettype, pageSize, currentPage }) {
        try {
            const token = localStorage.getItem('873__jh6bdjktoken');

            const response = await fetch(`${BASE_URL}/wallet/assets?wallettype=${wallettype}&assetType=${assettype}&pageSize=${pageSize}&currentPage=${currentPage}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const { assets, paginator } = data;
            commit('SET_WALLETASSETS', assets);
            commit('SET_WALLETASSETSPAGINATOR', paginator);
        } catch (error) {
            throw error;
        }
    },
    async setwalletassetscategory({ commit }, assettype) {
        commit('SET_WALLETASSETSTCATEGORY', assettype);
    }
}