import { mapActions, mapState, mapMutations } from 'vuex';

import global from "@/mixins/global.js";

export default {
    data() {
        return {
            firstname: null,
            lastname: null,
            email: null,
            phonenumber: null,
            password: null,
            confirmpassword: null,
            termscheckbox: false,
            passwordInputTypeToText: false,
            confirmpasswordInputTypeToText: false,
            termscontenterror: false,
            autherror: false
        }
    },
    mixins: [global],
    computed: {
        ...mapState({
            assets: state => state.list.assets,
            authError: state => state.auth.authError
        }),
        assets() {
            return this.assets;
        }
    },
    methods: {
        ...mapActions('list', ['getassets']),
        ...mapMutations('auth', ['SET_AUTH_ERROR']),
        closeAuthError() {
            const { SET_AUTH_ERROR } = this;
            this.autherror = false;
            SET_AUTH_ERROR(false);
        },
        routeToAuthPage(page) {
            this.$router.push(`/${page}`)
        },
        validateEmail(email) {
            // Regular expression for email validation
            const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

            return emailRegex.test(email);
        },
        toggleInputType(input) {
            if (input === 'password') {
                if (!this.passwordInputTypeToText) {
                    this.passwordInputTypeToText = true;
                } else {
                    this.passwordInputTypeToText = false;
                }
            }

            if (input === 'confirmpassword') {
                if (!this.confirmpasswordInputTypeToText) {
                    this.confirmpasswordInputTypeToText = true
                } else {
                    this.confirmpasswordInputTypeToText = false
                }
            }
        },
    },
    mounted() {
        this.getassets();
    }
}