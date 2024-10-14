<template>
  <div>
    <div class="settings">
      <div class="content">
        <HeaderBox />

        <div class="popup" v-if="currentEditSubject">
          <div class="popup__body">
            <div class="transactionstyle__subject">
              <div class="transactionstyle__subject--name">
                <h3>Edit {{ currentEditSubject }}</h3>
              </div>
              <span class="popup__close" @click="closePop">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="css-3kwgah"
                >
                  <path
                    d="M6.697 4.575L4.575 6.697 9.88 12l-5.304 5.303 2.122 2.122L12 14.12l5.303 5.304 2.122-2.122L14.12 12l5.304-5.303-2.122-2.122L12 9.88 6.697 4.575z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
            </div>

            <div class="settings__inputsection" v-if="currentEditSubject === 'email'">
              <div class="settings__inputarea">
                <label>Change email:</label>
                <span class="auth__inputarea--input">
                  <input v-model="email" ref="email" />
                </span>
              </div>

              <div class="settings__popbtns">
                <button class="btn padded-btn greyed-btn" @click="closePop">
                  Cancel
                </button>
                <button class="btn padded-btn colored-btn" @click="submitEmailChange">
                  Save
                </button>
              </div>
            </div>

            <div
              class="settings__inputsection"
              v-if="currentEditSubject === 'phonenumber'"
            >
              <div class="settings__inputarea">
                <label>Change phonenumber:</label>
                <span class="auth__inputarea--input">
                  <input v-model="phonenumber" ref="phonenumber" />
                </span>
              </div>

              <div class="settings__popbtns">
                <button class="btn padded-btn greyed-btn" @click="closePop">
                  Cancel
                </button>
                <button
                  class="btn padded-btn colored-btn"
                  @click="submitPhonenumberChange"
                >
                  Save
                </button>
              </div>
            </div>

            <div class="settings__inputsection" v-if="currentEditSubject === 'password'">
              <div class="settings__inputarea">
                <label>Old Password:</label>
                <span class="auth__inputarea--input">
                  <input v-model="oldpassword" type="password" ref="oldpassword" />
                </span>

                <label>New password:</label>
                <span class="auth__inputarea--input">
                  <input v-model="password" type="password" ref="password" />
                </span>

                <label>Confirm new password:</label>
                <span class="auth__inputarea--input">
                  <input
                    v-model="confirmpassword"
                    type="password"
                    ref="confirmpassword"
                  />
                </span>
              </div>

              <div class="settings__popbtns">
                <button class="btn padded-btn greyed-btn" @click="closePop">
                  Cancel
                </button>
                <button
                  class="btn padded-btn colored-btn"
                  @click="submitPasswordChange"
                  v-if="allowpasswordsubmit"
                >
                  Save
                </button>
                <button
                  class="btn padded-btn colored-btn faint"
                  v-if="!allowpasswordsubmit"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="content__body">
          <div class="container">
            <SideNav />

            <div class="layout-stretch">
              <PageIndicator :page_name="'Settings'" :transparent="true" :nobtns="true" />

              <div class="fiatandspot__main layout-padding">
                <!-- Structure for Name -->
                <div class="settings__area">
                  <div class="settings__area--logo"></div>
                  <div class="settings__area--content">
                    <div class="settings__area--content-subject">
                      <label>Email:</label>
                      <span>{{ client ? client.email : "" }}</span>
                    </div>
                    <div class="settings__area--content-description">
                      The primary email address associated with your account.
                    </div>
                  </div>
                  <div class="settings__area--btn">
                    <button class="btn padded-btn greyed-btn" @click="openPopup('email')">
                      Edit
                    </button>
                  </div>
                </div>

                <!-- Structure for Password -->
                <div class="settings__area">
                  <div class="settings__area--logo"></div>
                  <div class="settings__area--content">
                    <div class="settings__area--content-subject">
                      <label>Password:</label>
                      <span>••••••••</span>
                    </div>
                    <div class="settings__area--content-description">
                      Your secret key to access the account. Ensure it's strong and
                      unique.
                    </div>
                  </div>
                  <div class="settings__area--btn">
                    <button
                      class="btn padded-btn greyed-btn"
                      @click="openPopup('password')"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <!-- Structure for PhoneNumber -->
                <div class="settings__area">
                  <div class="settings__area--logo"></div>
                  <div class="settings__area--content">
                    <div class="settings__area--content-subject">
                      <label>PhoneNumber:</label>
                      <span>{{ client ? client.phonenumber : "" }}</span>
                    </div>
                    <div class="settings__area--content-description">
                      The primary phone number for account recovery and notifications.
                    </div>
                  </div>
                  <div class="settings__area--btn">
                    <button
                      class="btn padded-btn greyed-btn"
                      @click="openPopup('phonenumber')"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

import BASE_VARS from "@/store/base_vars";

const { BASE_URL } = BASE_VARS;

export default {
  data() {
    return {
      currentEditSubject: null,
      email: "",
      phonenumber: "",
      oldpassword: "",
      password: "",
      confirmpassword: "",
    };
  },
  computed: {
    ...mapState({
      client: (state) => state.auth.client,
    }),
    allowpasswordsubmit() {
      if (this.isValidPassword() && this.passwordsMatch() && this.oldpassword.length) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    ...mapActions("settings", ["updateEmail", "updatePhoneNumber"]),
    isValidEmail() {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return emailPattern.test(this.email);
    },
    isValidPassword() {
      return this.password.length >= 8;
    },
    passwordsMatch() {
      return this.password === this.confirmpassword;
    },
    isValidForm() {
      return this.isValidEmail() && this.isValidPassword() && this.passwordsMatch();
    },
    openPopup(currentEditSubject) {
      if (currentEditSubject === "email") {
        this.currentEditSubject = "email";
      }

      if (currentEditSubject === "phonenumber") {
        this.currentEditSubject = "phonenumber";
      }

      if (currentEditSubject === "password") {
        this.currentEditSubject = "password";
      }
    },
    closePop() {
      this.currentEditSubject = null;
    },
    submitEmailChange() {
      if (this.isValidEmail()) {
        this.updateEmail(this.email)
          .then((data) => {
            this.$router.go();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    submitPhonenumberChange() {
      if (this.phonenumber.length) {
        this.updatePhoneNumber(this.phonenumber)
          .then((data) => {
            this.$router.go();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    async submitPasswordChange() {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");

        const response = await fetch(`${BASE_URL}/settings/password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldpassword: this.oldpassword,
            newpassword: this.password,
          }),
        });

        if (!response.ok) {
          alert("wrong password, please retype your old password");
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          alert("password changed successfully");
          this.$router.go();
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    email(newVal, oldVal) {
      if (this.currentEditSubject === "email") {
        this.isValidEmail()
          ? this.$refs.email.classList.remove("error")
          : this.$refs.email.classList.add("error");
      }
    },
    phonenumber(newVal, oldVal) {
      if (this.currentEditSubject === "phonenumber") {
        if (this.phonenumber.length) {
          this.$refs.phonenumber.classList.remove("error");
        } else {
          this.$refs.phonenumber.classList.add("error");
        }
      }
    },
    password(newVal, oldVal) {
      if (this.currentEditSubject === "password") {
        this.isValidPassword()
          ? this.$refs.password.classList.remove("error")
          : this.$refs.password.classList.add("error");
        this.passwordsMatch()
          ? this.$refs.confirmpassword.classList.remove("error")
          : this.$refs.confirmpassword.classList.add("error");
      }
    },
    confirmpassword(newVal, oldVal) {
      if (this.currentEditSubject === "password") {
        this.passwordsMatch()
          ? this.$refs.confirmpassword.classList.remove("error")
          : this.$refs.confirmpassword.classList.add("error");
      }
    },
    client(newVal, oldVal) {
      this.email = this.client.email;
      this.phonenumber = this.client.phonenumber;
    },
  },
};
</script>
