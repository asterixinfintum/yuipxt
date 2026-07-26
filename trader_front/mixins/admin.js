import socket from '@/plugins/socket.js';

export default {
    data() {
        return {
            DEVELOPMENT: false,
            agent: null,
            socket
        }
    },
    computed: {
        baseurl() {
            const { DEVELOPMENT } = this;
            let url;

            if (DEVELOPMENT) {
                url = "http://localhost:8082";
            } else {
                url = "https://api.bsn.finance";
            }

            return url;
        }
    },
    methods: {
        adminrouter(page) {
            const { admin } = this.$route.params;

            return this.$router.push({ path: `/admin/account/${page}/${admin}` });
        },
        async adminlogin() {
            const { username, password, baseurl } = this;

            if (username && password) {
                if (username.length && password.length) {

                    const body = JSON.stringify({ username, password });

                    try {
                        const response = await fetch(`${baseurl}/admin/login`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: body
                        });

                        if (!response.ok) {
                            throw new Error('Login failed with status: ' + response.status);
                        }

                        const data = await response.json();
                        const { agentdata, token } = data;

                        localStorage.setItem('873__jh6bdjktoken', token);
                        this.agent = agentdata
                        this.$router.push({ path: `/admin/account/users/${this.agent._id}` });
                    } catch (error) {
                        console.error('Error during login:', error);
                        throw error;
                    }
                }
            }
        }
    }
}