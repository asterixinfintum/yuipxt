import BASE_VARS from './base_vars';

const { BASE_URL } = BASE_VARS;

export const actions = {
    async updateEmail({ commit }, email) {
        try {
            const token = localStorage.getItem('873__jh6bdjktoken');
            const response = await fetch(`${BASE_URL}/settings/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Adjust if the token format needs changes.
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data);
            }

            // Commit a mutation if necessary
            // commit('YOUR_MUTATION_NAME', data);

            return data;
        } catch (error) {
            console.error('Error updating email:', error);
            throw error; // Rethrow the error to be handled by the caller
        }
    },
    async updatePhoneNumber({ commit }, phonenumber) {
        try {
            const token = localStorage.getItem('873__jh6bdjktoken');
            const response = await fetch(`${BASE_URL}/settings/phonenumber`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Adjust if the token format needs changes.
                },
                body: JSON.stringify({ phonenumber })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data);
            }

            // Commit a mutation if necessary
            // commit('YOUR_MUTATION_NAME', data);

            return data;
        } catch (error) {
            console.error('Error updating phone number:', error);
            throw error; // Rethrow the error to be handled by the caller
        }
    }
}
