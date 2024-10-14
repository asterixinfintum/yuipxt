import BASE_VARS from './base_vars';

const { BASE_URL } = BASE_VARS;

export const state = () => ({
    items: [],
    item: null
});

export const mutations = {
    SET_ITEMS(state, data) {
        state.items = data;
    },
    SET_ITEM(state, data) {
        state.item = data;
    }
}

export const actions = {
    async getinhouseassets({ commit }) {
        return new Promise((resolve, reject) => {
            try {
                const token = localStorage.getItem('873__jh6bdjktoken');

                if (!token) {
                    return;
                }

                fetch(`${BASE_URL}/inhouseassets`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        const { assets } = data;
                        commit('SET_ITEMS', assets);
                    });
            } catch (error) {
                console.log(error)
            }
        });
    }
}