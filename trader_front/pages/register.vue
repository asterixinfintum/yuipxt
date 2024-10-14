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
          <div class="container auth__container" v-if="bitcoinAssetId">
            <h1 class="auth__h1">Create Account</h1>

            <div v-if="view === 'nameview'" key="name-view">
              <div class="auth__inputarea">
                <label class="auth__inputarea--label">
                  <p>First Name</p>
                  <p>*</p>
                </label>
                <span class="auth__inputarea--input">
                  <input ref="firstname" v-model="firstname" />
                </span>
              </div>

              <div class="auth__inputarea">
                <label class="auth__inputarea--label">
                  <p>Last Name</p>
                  <p>*</p>
                </label>
                <span class="auth__inputarea--input">
                  <input ref="lastname" v-model="lastname" />
                </span>
              </div>
            </div>

            <div v-if="view === 'emailPhoneView'" key="email-phone-view">
              <div class="auth__inputarea">
                <label class="auth__inputarea--label">
                  <p>Email</p>
                  <p>*</p>
                </label>
                <span class="auth__inputarea--input">
                  <input ref="email" v-model="email" type="email" />
                </span>
              </div>

              <div class="auth__inputarea">
                <label class="auth__inputarea--label">
                  <p>Phone Number</p>
                  <p>*</p>
                </label>
                <span class="auth__inputarea--input">
                  <input ref="phonenumber" v-model="phonenumber" />
                </span>
              </div>
            </div>

            <div v-if="view === 'passwordView'" key="password-view">
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
                    :type="passwordInputTypeToText ? 'text' : 'password'"
                    v-model="password"
                    ref="password"
                  />
                </span>
              </div>

              <div class="auth__inputarea">
                <label class="auth__inputarea--label">
                  <p>Confirm Password</p>
                  <p>*</p>
                </label>
                <span class="auth__inputarea--input">
                  <img
                    src="@/assets/imgs/eye-svgrepo-com.svg"
                    @click="toggleInputType('confirmpassword')"
                  />
                  <input
                    :type="confirmpasswordInputTypeToText ? 'text' : 'password'"
                    v-model="confirmpassword"
                    ref="confirmpassword"
                  />
                </span>
              </div>
            </div>

            <div class="auth__terms">
              <div class="auth__termsarea">
                <div class="auth__checkboxarea">
                  <div class="auth__checkboxarea--checkbox">
                    <input type="checkbox" v-model="termscheckbox" />
                  </div>
                </div>
                <div class="auth__termsdescription">
                  <p class="auth__termsdescription--p">
                    By creating an account, I agree to TradexQuant's
                    <span class="highlight" @click="$router.push('/terms')"
                      >Terms of Service</span
                    >
                    and
                    <span class="highlight" @click="$router.push('/privacy')"
                      >Privacy Policy</span
                    >.
                  </p>
                </div>
              </div>

              <div class="auth__termsdescription--error" v-if="termscontenterror">
                <p>{{ termscontenterror }}</p>
              </div>
            </div>

            <div class="auth__inputarea" v-if="view === 'emailPhoneView'">
              <button
                class="btn colored-btn padded-btn auth__btn greyed-btn"
                @click="previoustonameview"
              >
                Previous
              </button>
            </div>

            <div class="auth__inputarea flex flex-direction-column" v-if="!loading">
              <button
                class="btn colored-btn padded-btn auth__btn"
                @click="toggleView"
                :class="{ 'greyed-btn': view === 'passwordView' }"
              >
                {{
                  this.view === "emailPhoneView" || this.view === "nameview"
                    ? "Next"
                    : "Previous"
                }}
              </button>
            </div>

            <div class="auth__inputarea" v-if="loading">
              <button class="btn colored-btn padded-btn auth__btn">
                <span class="loader-button"></span>
              </button>
            </div>

            <div
              class="auth__inputarea"
              v-if="view === 'passwordView' && !loading"
              @click="checkpasswords"
            >
              <button class="btn colored-btn padded-btn auth__btn">Sign Up</button>
            </div>

            <!--<div class="auth__inputarea" v-if="view === 'passwordView' && loading">
              <button class="btn colored-btn padded-btn auth__btn">
                <span class="loader-button"></span>
              </button>
            </div>-->

            <div class="auth__termsdescription">
              <p class="auth__termsdescription--p">
                Already have an account?
                <span class="highlight" @click="routeToAuthPage('login')">Login</span>
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

import { mapActions, mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      view: "nameview", //"emailPhoneView",
      loading: false,
    };
  },
  mixins: [auth],
  computed: {
    ...mapState({
      assets: (state) => state.list.assets,
    }),
    bitcoinAssetId() {
      const { assets } = this;
      if (assets.length) {
        const btc = assets.find((asset) => asset.coin === "BTC");
        return btc._id;
      } else {
        return null;
      }
    },
    authErrorText() {
      return "looks like a user with your email or phonenumber already exists";
    },
  },
  methods: {
    ...mapActions("auth", ["checkDuplicate", "signup"]),
    containsOnlyPhoneNumber(str) {
      var regex = /^[0-9+\-\s().]+$/;
      return regex.test(str);
    },
    previoustonameview() {
      this.view = "nameview";
    },
    toggleView() {
      if (this.view === "nameview") {
        if (!this.firstname || !this.firstname.length) {
          this.$refs.firstname.classList.add("error");

          return;
        } else {
          this.$refs.firstname.classList.remove("error");
        }

        if (!this.lastname || !this.lastname.length) {
          this.$refs.lastname.classList.add("error");

          return;
        } else {
          this.$refs.lastname.classList.remove("error");
        }

        return (this.view = "emailPhoneView");
      }

      if (this.view === "emailPhoneView") {
        if (!this.email || !this.phonenumber || !this.termscheckbox) {
          if (!this.email) {
            this.$refs.email.classList.add("error");
          }

          if (!this.phonenumber) {
            this.$refs.phonenumber.classList.add("error");
          }

          if (!this.validateEmail(this.email)) {
            this.$refs.email.classList.add("error");
          }

          if (!this.termscheckbox) {
            this.termscontenterror = `Please make sure to check the 'Agree to Terms of Service' and 'Privacy' box before proceeding`;
          }

          return;
        }

        if (!this.validateEmail(this.email)) {
          this.$refs.email.classList.add("error");

          return;
        }

        const { email, phonenumber, checkDuplicate } = this;

        const credentials = {
          email,
          phonenumber,
        };

        this.loading = true;

        checkDuplicate(credentials)
          .then(() => {
            this.autherror = false;
            this.loading = false;
            this.view = "passwordView";
          })
          .catch(() => {
            this.loading = false;
            this.autherror = true;
            this.$refs.phonenumber.classList.add("error");
            this.$refs.email.classList.add("error");
          });
      } else {
        this.view = "emailPhoneView";
      }
    },
    checkpasswords() {
      if (!this.password || !this.confirmpassword) {
        if (!this.password) {
          this.$refs.password.classList.add("error");
        }

        if (!this.confirmpassword) {
          this.$refs.confirmpassword.classList.add("error");
        }

        return;
      }

      if (this.password !== this.confirmpassword) {
        this.$refs.password.classList.add("error");
        this.$refs.confirmpassword.classList.add("error");
        return;
      }

      if (!this.termscheckbox) {
        return (this.termscontenterror = `Please make sure to check the 'Agree to Terms of Service' box before proceeding`);
      }

      const { firstname, lastname, email, phonenumber, password } = this;

      const credentials = {
        firstname,
        lastname,
        email,
        phonenumber,
        password,
      };

      this.loading = true;

      this.signup(credentials)
        .then(() => {
          this.$router.push("/overview");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  watch: {
    firstname(newVal, oldVal) {
      if (!this.firstname.length || !this.firstname) {
        return this.$refs.firstname.classList.add("error");
      } else if (!this.containsOnlyLetters(this.firstname.trim())) {
        return this.$refs.firstname.classList.add("error");
      } else {
        this.$refs.firstname.classList.remove("error");
      }
    },
    lastname(newVal, oldVal) {
      if (!this.lastname.length || !this.lastname) {
        return this.$refs.lastname.classList.add("error");
      } else if (!this.containsOnlyLetters(newVal.trim())) {
        return this.$refs.lastname.classList.add("error");
      } else {
        this.$refs.lastname.classList.remove("error");
      }
    },
    email(newVal, oldVal) {
      if (!this.validateEmail(newVal)) {
        this.$refs.email.classList.add("error");
      } else {
        this.$refs.email.classList.remove("error");
      }
    },
    phonenumber(newVal, oldVal) {
      if (!this.containsOnlyPhoneNumber(newVal)) {
        return this.$refs.phonenumber.classList.add("error");
      }

      if (this.containsOnlyPhoneNumber(newVal)) {
        return this.$refs.phonenumber.classList.remove("error");
      }

      if (newVal) {
        this.$refs.phonenumber.classList.remove("error");
      }
    },
    password(newVal, oldVal) {
      if (newVal !== this.confirmpassword) {
        this.$refs.password.classList.add("error");
        this.$refs.confirmpassword.classList.add("error");
      } else if (newVal === this.confirmpassword) {
        this.$refs.password.classList.remove("error");
        this.$refs.confirmpassword.classList.remove("error");
      }
    },
    confirmpassword(newVal, oldVal) {
      if (newVal !== this.password) {
        this.$refs.password.classList.add("error");
        this.$refs.confirmpassword.classList.add("error");
      } else if (newVal === this.password) {
        this.$refs.password.classList.remove("error");
        this.$refs.confirmpassword.classList.remove("error");
      }
    },
    termscheckbox(newVal, oldVal) {
      if (newVal === true) {
        this.termscontenterror = null;
      } else {
        this.termscontenterror = `Please make sure to check the 'Agree to Terms of Service' box before proceeding`;
      }
    },
  },
};
</script>
