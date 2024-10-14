import BASE_VARS from './base_vars';

const { BASE_URL } = BASE_VARS;

export const state = () => ({
    tradingbots: []
});

export const mutations = {
    SET_TRADINGBOTS(state, data) {
        state.tradingbots = data;
    }
}

export const actions = {
    async createBot({ commit }, strategy) {
        return new Promise((resolve, reject) => {
            try {
                const token = localStorage.getItem('873__jh6bdjktoken');

                fetch(`${BASE_URL}/createbot`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(strategy)
                })
                .then(response => response.json())
                .then(data => {
                    const { strategyItem } = data;
                    resolve(strategyItem);
                })
            } catch (error) {
                reject(error);
            }
        })
    },

    async getBots({ commit }) {
        return new Promise((resolve, reject) => {
            try {
                const token = localStorage.getItem('873__jh6bdjktoken');

                fetch(`${BASE_URL}/createbot`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    const { strategies } = data;
                    commit('SET_TRADINGBOTS', strategies);
                })
            } catch (error) {
                console.log(error)
            }
        });
    },

    async closeBot({ commit }, botid) {
        return new Promise((resolve, reject) => {
            try {
                const token = localStorage.getItem('873__jh6bdjktoken');

                fetch(`${BASE_URL}/closebot?strategyId=${botid}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                })
            } catch (error) {
                console.log(error)
            }
        });
    }
}