import { mapActions, mapState, mapMutations } from 'vuex';
import BASE_VARS from '@/store/base_vars';

const { BASE_URL } = BASE_VARS;

export default {
    data() {
        return {
            depositCardOpen: false
        }
    },
    computed: {
        ...mapState({
          client: state => state.auth.client,
          client_token: state => state.auth.client_token,
          wallettypes: state => state.wallet.wallettypes
        })
    },  
    methods: {
        ...mapMutations('auth', ['SET_CLIENT', 'SET_CLIENT_TOKEN']),
        getCurrentUser() {
            const token = localStorage.getItem('873__jh6bdjktoken');

            if (!token) {
                return;
            }

            try {
                fetch(`${BASE_URL}/getclient`, {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    const { token, userData } = data;

                    this.SET_CLIENT(userData);
                    this.SET_CLIENT_TOKEN(token);
                })
                .catch(error => {
                    console.log('Error:', error);
                });
            } catch (error) {
                console.log(error)
            }
        }
    },
    mounted() {
        this.getCurrentUser();
    }
}