<template>
  <div>
    <div class="header auth" id="header">
      <div class="header__left">
        <div class="header__logo" @click="$router.push('/')">
          <figure class="tradex-logo-headr">
            <img src="@/assets/imgs/logo_psb.png" />
          </figure>
          <p>TradexQuant</p>
        </div>
      </div>
    </div>

    <div v-if="authError && autherror">
      <ErrorPopup :error="authErrorText" :close="closeAuthError" />
    </div>

    <div class="auth">
      <div class="content">
        <div class="content__body">
          <div class="container auth__container">
            <h1 class="auth__h1">Login to your account</h1>

            <div>
              <div class="auth__inputarea">
                <label class="auth__inputarea--label">
                  <p>Email</p>
                  <p>*</p>
                </label>
                <span class="auth__inputarea--input">
                  <input v-model="email" ref="email" />
                </span>
              </div>

              <div class="auth__inputarea">
                <label class="auth__inputarea--label">
                  <p>Password</p>
                  <p>*</p>
                </label>
                <span class="auth__inputarea--input">
                  <img
                    src="@/assets/imgs/eye-svgrepo-com.svg"
                    @click="toggleInputType('password')"
                  />
                  <input
                    v-model="password"
                    ref="password"
                    :type="passwordInputTypeToText ? 'text' : 'password'"
                  />
                </span>
              </div>
            </div>

            <div class="auth__inputarea" @click="checkFormCompletion">
              <button class="btn colored-btn padded-btn auth__btn" v-if="!loading">
                Login
              </button>
            </div>

            <div class="auth__inputarea" v-if="loading">
              <button class="btn colored-btn padded-btn auth__btn">
                <span class="loader-button"></span>
              </button>
            </div>

            <div class="auth__termsdescription">
              <p class="auth__termsdescription--p">
                Don't have an account?
                <span class="highlight" @click="routeToAuthPage('register')"
                  >Sign Up</span
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "@/mixins/auth.js";

import { mapActions } from "vuex";

export default {
  data() {
    return {
      loading: false,
    };
  },
  mixins: [auth],
  computed: {
    authErrorText() {
      return "Wrong email or password";
    },
  },
  methods: {
    ...mapActions("auth", ["login"]),
    checkFormCompletion() {
      if (!this.password || !this.email) {
        if (!this.password) {
          this.$refs.password.classList.add("error");
        }

        if (!this.email) {
          this.$refs.email.classList.add("error");
        }

        return;
      }

      if (!this.validateEmail(this.email)) {
        this.$refs.email.classList.add("error");

        return;
      }

      const { email, password } = this;

      const credentials = {
        email,
        password,
      };

      this.loading = true;
      this.login(credentials)
        .then((data) => {
          this.loading = false;
          this.$router.push("/overview");
        })
        .catch((error) => {
          this.loading = false;
          console.log(error, "error here");
        });
    },
  },
  watch: {
    email(newVal, oldVal) {
      if (!this.validateEmail(newVal)) {
        this.$refs.email.classList.add("error");
      } else {
        this.$refs.email.classList.remove("error");
      }
    },
    password(newVal, oldVal) {
      if (newVal) {
        this.$refs.password.classList.remove("error");
      }
    },
    authError(newVal, oldVal) {
      if (newVal) {
        this.autherror = true;
        this.$refs.email.classList.add("error");
        this.$refs.password.classList.add("error");
      } else {
        this.autherror = false;
        this.$refs.email.classList.remove("error");
        this.$refs.password.classList.remove("error");
      }
    },
  },
};
</script>
