<template>
    <div class="base">
      <AuthFeedback v-if="feedback"/>
      <div class="base__content">
        <div class="base__left">
          <div class="base__harea">
            <h1>Get Started Now</h1>
            <h2>Enter your credentials and access your account</h2>
          </div>
  
          <div class="form">
            <div class="formArea">
              <label class="formInputLabel">User Name</label>
              <span class="formInputField" ref="user_name">
                <input type="text" v-model="user_name"/>
              </span>
            </div>
            <div class="formArea">
              <label class="formInputLabel">Password</label>
              <span class="formInputField" ref="password">
                <button class="formInputIcon" @click="toggle_password_field_state">
                  <svg>
                    <use xlink:href="@/assets/imgs/sprites.svg#icon-eye"></use>
                  </svg>
                </button>
                <input :type="password_field_state" v-model="password"/>
              </span>
            </div>
  
            <div class="formButtonArea">
              <button class="formSubmitbutton" @click="signin">Login</button>
            </div>
          </div>
  
        </div>
        <div class="base__right">
          <div class="base__right--background">
            <div class="base__rightharea">
              <h2>The simplest open source crm for managing leads and your workforce</h2>
              <h3>Enter your credentials to access your account</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import formMixin from '@/mixins/form.js';
  
  export default {
    data() {
      return {
  
      }
    },
    mixins: [formMixin]
  }
  </script>