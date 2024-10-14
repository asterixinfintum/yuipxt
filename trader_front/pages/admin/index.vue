<template>
  <div>
    <div class="adminauth">
      <div class="auth">
        <div class="content">
          <div class="content__body">
            <div class="container auth__container">
              <h1 class="auth__h1">Login as an admin</h1>

              <div>
                <div class="auth__inputarea">
                  <label class="auth__inputarea--label">
                    <p>User name here</p>
                    <p>*</p>
                  </label>
                  <span class="auth__inputarea--input">
                    <input v-model="username" ref="username" />
                  </span>
                </div>

                <div class="auth__inputarea">
                  <label class="auth__inputarea--label">
                    <p>Password</p>
                    <p>*</p>
                  </label>
                  <span class="auth__inputarea--input">
                    <input v-model="password" ref="password" />
                  </span>
                </div>

                <div class="auth__inputarea">
                  <button
                    class="btn colored-btn padded-btn auth__btn"
                    v-if="!loading"
                    @click="adminlogin"
                  >
                    Login
                  </button>
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
import adminMixin from "@/mixins/admin";

export default {
  mixins: [adminMixin],
  data() {
    return {
      username: "",
      password: "",
      loading: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.adminauth {
}
</style>
