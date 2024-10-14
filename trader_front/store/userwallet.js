import BASE_VARS from './base_vars';

const { BASE_URL } = BASE_VARS;

export const state = () => ({
    userwalletassets_list: [],
    userwallets: [],
    spotwallet: null,
    marginwallet: null,
    walletusdtotal: 0,
    walletbtctotal: 0,
    totalitems: 0,
    tradeaccountmargin: 0,
    tradeaccountdebt: 0,
    tradeaccountequity: 0,
    tradeaccountdebtInBtc: 0,
    tradeaccountmarginInBtc: 0,
    tradeaccountequityInBtc: 0
});

export const mutations = {
    SET_USERWALLETS(state, data) {
        state.userwallets = data;
    },
    SET_SPOTWALLET(state, data) {
        state.spotwallet = data;
    },
    SET_MARGINWALLET(state, data) {
        state.marginwallet = data;
    },
    SET_USERWALLETSLIST(state, data) {
        state.userwalletassets_list = data;
    },
    SET_USERWALLETSUSDTOTAL(state, data) {
        state.walletusdtotal = data;
    },
    SET_USERWALLETSBTCTOTAL(state, data) {
        state.walletbtctotal = data;
    },
    SET_TOTALITEMS(state, data) {
        state.totalitems = data;
    },
    SET_TRADEACCOUNTDEBT(state, data) {
        state.tradeaccountdebt = data;
    },
    SET_TRADEACCOUNTMARGIN(state, data) {
        state.tradeaccountmargin = data;
    },
    SET_TRADEACCOUNTEQUITY(state, data) {
        state.tradeaccountequity = data;
    },
    SET_TRADEACCOUNTDEBT_BTC(state, data) {
        state.tradeaccountdebtInBtc = data;
    },
    SET_TRADEACCOUNTMARGIN_BTC(state, data) {
        state.tradeaccountmarginInBtc = data;
    },
    SET_TRADEACCOUNTEQUITY_BTC(state, data) {
        state.tradeaccountequityInBtc = data;
    },
}

export const actions = {
    async getuserwallets({ commit }, userid) {
        try {
            const token = localStorage.getItem('873__jh6bdjktoken');

            const response = await fetch(`${BASE_URL}/userwallet/getall?userid=${userid}`, {
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
            const { userwallets } = data;

            const spotwallet = userwallets.find(wallet => wallet.wallettype === 'spot');
            const marginwallet = userwallets.find(wallet => wallet.wallettype === 'margin');

            console.log('marginwallet:', marginwallet);
            console.log('spotwallet:', spotwallet);

            commit('SET_USERWALLETS', userwallets);
            commit('SET_SPOTWALLET', spotwallet);
            commit('SET_MARGINWALLET', marginwallet);
        } catch (error) {
            throw error;
        }
    },
    async getusermargindashboard({ commit }, { userid }) {
        try {
            const token = localStorage.getItem('873__jh6bdjktoken');

            const response = await fetch(`${BASE_URL}/userwallet/margindashboard?userid=${userid}`, {
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

            const {
                tradeaccountdebtInBtc, 
                tradeaccountmarginInBtc,
                tradeaccountequityInBtc,
                tradeaccountequity,
                tradeaccountdebt,
                tradeaccountmargin
            } = data;

            commit('SET_TRADEACCOUNTDEBT', tradeaccountdebt);
            commit('SET_TRADEACCOUNTMARGIN', tradeaccountmargin);
            commit('SET_TRADEACCOUNTEQUITY', tradeaccountequity);
            commit('SET_TRADEACCOUNTDEBT_BTC', tradeaccountdebtInBtc);
            commit('SET_TRADEACCOUNTMARGIN_BTC', tradeaccountmarginInBtc);
            commit('SET_TRADEACCOUNTEQUITY_BTC', tradeaccountequityInBtc);
        } catch (error) {
            console.log(error)
        }
    },
    async getuserwallet({ commit }, { walletid, assettype, start, end, searchquery }) {
        try {
            const token = localStorage.getItem('873__jh6bdjktoken');

            const response = await fetch(`${BASE_URL}/userwallet/wallet?walletid=${walletid}&assettype=${assettype}&start=${start}&end=${end}&searchquery=${searchquery}`, {
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

            const { walletbalance } = data;
            const { walletassets_list, usdtotal, btctotal, total } = walletbalance;

            console.log('btctotal:', btctotal);

            commit('SET_USERWALLETSLIST', walletassets_list);
            commit('SET_USERWALLETSUSDTOTAL', usdtotal);
            commit('SET_USERWALLETSBTCTOTAL', btctotal);

            if (total) {
                commit('SET_TOTALITEMS', total);
            }
        } catch (error) {
            throw error;
        }
    }
}