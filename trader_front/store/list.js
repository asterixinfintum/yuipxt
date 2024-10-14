import BASE_VARS from './base_vars';

const { BASE_URL } = BASE_VARS;

export const state = () => ({
    originalList: [],
    paginatedList: [],
    assets: [],
    //originalInhouseAssets: [],
    //paginatedOriginalInhouseAssets: [],
});

export const mutations = {
    SET_PAGINATEDLIST(state, data) {
        state.paginatedList = data;
    },
    SET_ORIGINALLIST(state, data) {
        state.originalList = data;
    },
    SET_ASSETS(state, data) {
        state.assets = data;
    },
}

export const actions = {
    async search({ commit, state }, searchTerm) {
        const { originalList } = state;

        if (searchTerm.length) {
            const filtered = originalList.filter(item => item.coin.trim().toLowerCase().includes(searchTerm) || item.name.trim().toLowerCase().includes(searchTerm))
            commit('SET_PAGINATEDLIST', filtered);
        } 
        
        if (!searchTerm.length) {
            commit('SET_PAGINATEDLIST', originalList);
        }
    },
    async getassets({ commit }) {
        try { 
            fetch(`${BASE_URL}/assets`)
                .then(response => response.json())
                .then(data => {
                    const { assets } = data;
                    commit('SET_ASSETS', assets);
                })
                .catch(error => {
                    console.log(error)
                    console.error('Error:', error);
                });
        } catch (error) {
            console.log(error)
        }
    }
}