import variables from './variables';

const { BASE_API_URL } = variables;

export const state = () => ({
    items: [],
    item: null
});

export const mutations = {
    SET_ANNOUNCEMENTS(state, data) {
        state.items = data;
    },
    SET_ANNOUNCEMENT(state, data) {
        state.item = data;
    }
}

export const actions = {
    async getAnnouncements({ commit }) {
        const admin_token = localStorage.getItem('873__jh6bdjkadmtoken');

        return new Promise((resolve, reject) => {
            try {
                fetch(`${BASE_API_URL}/announcements`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${admin_token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    const { annnmnts } = data;
                    commit('SET_ANNOUNCEMENTS', annnmnts);
                });
            } catch (error) {
                console.log(error)
            }
        })
    }
}