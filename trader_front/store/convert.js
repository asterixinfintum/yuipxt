import BASE_VARS from './base_vars';

const { BASE_URL } = BASE_VARS;

export const actions = {
    async executeConversion({ commit }, conversion) {
        try {
            const token = localStorage.getItem('873__jh6bdjktoken');

            const response = await fetch(`${BASE_URL}/convert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(conversion)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in executeConversion:', error);
            throw error; // Rethrow the error to be handled by the caller
        }
    }
}
