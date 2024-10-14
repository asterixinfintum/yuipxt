import BASE_VARS from './base_vars';

const { BASE_URL } = BASE_VARS;

export const state = () => ({
    orders: [],
    order: null,
    autotrades: [],
    trades: [],
    autotradestrategies: []
});

export const mutations = {
    SET_ORDERS(state, data) {
        state.orders = data;
    },
    SET_ORDER(state, data) {
        state.order = data;
    },
    SET_AUTOTRADES(state, data) {
        state.autotrades = data;
    },
    SET_AUTOTRADESTRATEGIES(state, data) {
        state.autotradestrategies = data;
    },
    SET_TRADES(state, data) {
        state.trades = data;
    },
    SET_AUTOTRADESTRATEGIESARRAY(state, data) {
        state.autotradestrategies = data;
    }
}

export const actions = {
    addAutoTradeStrategy({ commit, state }, subStrategyData) {
        const updatedStrategies = [subStrategyData, ...state.autotradestrategies.filter(strat => strat.substrategy !== subStrategyData.substrategy)];
        commit('SET_AUTOTRADESTRATEGIES', updatedStrategies);
    },
    removeStrategy({ commit }, filter) {
        commit('SET_AUTOTRADESTRATEGIESARRAY', filter);
    },
    async getorders({ commit }) {
        try {
            const token = localStorage.getItem('873__jh6bdjktoken');
            const response = await fetch(`${BASE_URL}/orders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const { orders } = await response.json();
            commit('SET_ORDERS', orders);
            return orders;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },
    async getautotrades({ commit }) {
        try {
            const token = localStorage.getItem('873__jh6bdjktoken');
            const response = await fetch(`${BASE_URL}/autotrades`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const { autotrades } = await response.json();
            commit('SET_AUTOTRADES', autotrades);
            return autotrades;
        } catch (error) {
            console.error('Error fetching autotrades:', error);
            throw error;
        }
    },
    async gettrades({ commit }) {
        try {
            const token = localStorage.getItem('873__jh6bdjktoken');
            const response = await fetch(`${BASE_URL}/trades`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const { executedtrades } = await response.json();
            commit('SET_TRADES', executedtrades);
            return executedtrades;
        } catch (error) {
            console.error('Error fetching trades:', error);
            throw error;
        }
    },
    async createAutoTrade({ commit }, autotrade) {
        try {
            const token = localStorage.getItem('873__jh6bdjktoken');

            const response = await fetch(`${BASE_URL}/order/automatictrade`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(autotrade)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating market order:', error);
            // Handle or throw the error based on your use case
            throw error;
        }
    },
    async createMktOrder({ commit }, order) {
        try {
            const token = localStorage.getItem('873__jh6bdjktoken');

            const response = await fetch(`${BASE_URL}/order/market`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating market order:', error);
            // Handle or throw the error based on your use case
            throw error;
        }
    },
    async createLmtOrder({ commit }, order) {
        try {
            const token = localStorage.getItem('873__jh6bdjktoken');

            const response = await fetch(`${BASE_URL}/order/limit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },
    async createStpLmtOrder({ commit }, order) {
        try {
            const token = localStorage.getItem('873__jh6bdjktoken');

            const response = await fetch(`${BASE_URL}/order/stoplimit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}