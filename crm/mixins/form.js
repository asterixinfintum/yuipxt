import { mapActions, mapState, mapMutations } from 'vuex';

import urlMixin from '@/mixins/url.js';
import utilityMixin from '@/mixins/utility.js';

export default {
    data() {
        return {
            user_name: '',
            email: '',
            password: '',
            confirm_password: '',
            password_field_state: "password",
            feedback: false,
            errors: {
                user_name: '',
                email: '',
                password: '',
                confirm_password: ''
            }
        }
    },
    mixins: [urlMixin, utilityMixin],
    methods: {
        ...mapActions('auth', ['login']),
        toggle_password_field_state() {
            this.password_field_state === "password" ? this.password_field_state = "text" : this.password_field_state = "password"
        },
        signup() {
            const { user_name, email, password, confirm_password, validateFormSignup, handleSubmitSignup } = this;

            const formData = {
                user_name,
                email,
                password,
                confirm_password
            };

            const errors = validateFormSignup(formData);
            if (Object.keys(errors).length === 0) {
                handleSubmitSignup();
            } else {
                for (const [key, value] of Object.entries(errors)) {
                    console.log(`${key}: ${value}`);
                    this.$refs[`${key}`].classList.add('error')
                }
            }
        },
        signin() {
            const { user_name, password, validateFormSignin, handleSubmitSignin } = this;

            const formData = {
                user_name,
                password,
            };

            const errors = validateFormSignin(formData);

            if (Object.keys(errors).length === 0) {
                handleSubmitSignin();
            } else {
                for (const [key, value] of Object.entries(errors)) {
                    console.log(`${key}: ${value}`);
                    this.$refs[`${key}`].classList.add('error')
                }
            }
        },
        handleSubmitSignin() {
            const { routeTo, user_name, password, login } = this;
            this.feedback = true;

            login({ user_name, password })
              .then(({ adminData, token }) => {
                routeTo(`/admin/${adminData._id}`);
              })
              .catch(err => {
                console.log(err)
              });
        },
        validateFormSignup(formData) {
            const errors = {};
          
            if (!formData.user_name) {
              errors.user_name = 'User name is required';
            }
          
            if (!formData.email) {
              errors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
              errors.email = 'Email is not valid';
            }
          
            if (!formData.password) {
              errors.password = 'Password is required';
            } else if (formData.password.length < 6) {
              errors.password = 'Password must be at least 6 characters long';
            }
          
            if (!formData.confirm_password) {
              errors.confirm_password = 'Confirm password is required';
            } else if (formData.confirm_password !== formData.password) {
              errors.confirm_password = 'Passwords do not match';
            }
          
            return errors;
          },
          validateFormSignin(formData) {
            const errors = {};

            if (!formData.user_name) {
                errors.user_name = 'User name is required';
            }

            if (!formData.password) {
                errors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                errors.password = 'Password must be at least 6 characters long';
            }

            return errors;
          }   
    },
    watch: {
        user_name(newVal) {
          if (newVal.length >= 3) {
            this.errors.user_name = '';
            this.$refs.user_name.classList.remove('error');
          }
        },
        email(newVal) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(newVal)) {
            this.errors.email = '';
            this.$refs.email.classList.remove('error');
          }
        },
        password(newVal) {
          if (newVal.length >= 6) {
            this.errors.password = '';
            this.$refs.password.classList.remove('error');
          }

          if (this.$refs.confirm_password != undefined) {
            if (this.confirm_password === newVal) {
                this.errors.confirm_password = '';
                this.$refs.confirm_password.classList.remove('error');
            }
          }
        },
        confirm_password(newVal) {
          if (newVal.length >= 6 && newVal === this.password) {
            this.errors.confirm_password = '';
            this.$refs.confirm_password.classList.remove('error');
          }
        }
      },
}