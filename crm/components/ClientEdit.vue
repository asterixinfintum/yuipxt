<template>
    <div class="createclientform">
      <h1 class="createclientform__h1">Add a contact here</h1>
      <label class="createclientform__label" for="email">Email:</label>
      <input class="createclientform__input" type="text" id="email" v-model="email" />
  
      <label class="createclientform__label" for="phonenumber">Phone Number:</label>
      <input class="createclientform__input" type="text" id="phonenumber" v-model="phonenumber" />
  
      <label class="createclientform__label" for="password">Password:</label>
      <input class="createclientform__input" type="text" id="password" v-model="password" />
  
      <label class="createclientform__label" for="verified">Verified: (set to true or false)</label>
      <input class="createclientform__input" type="text" id="verified" v-model="verified" />

      <label class="createclientform__label" for="anonid">AnonId:</label>
      <input class="createclientform__input" type="text" id="anonid" v-model="anonid" />
  
      <div v-for="(field, index) in customFields" :key="index" class="createclientform__custom">
        <label :for="'field-' + index" class="createclientform__label">{{ fieldNames[index] }}:</label>
        <input :id="'field-' + index" type="text" v-model="customFields[index]" class="createclientform__input" />
      </div>
  
      <div v-if="showNewField" class="createclientform__new">
        <div class="createclientform__newfieldarea">
            <label for="new-field-name" class="createclientform__label">Field Name:</label>
            <input type="text" id="new-field-name" v-model="newFieldName" class="createclientform__input" />
        </div>
  
        <div class="createclientform__newfieldarea">
            <label for="new-field-value" class="createclientform__label">Field Value:</label>
            <input type="text" id="new-field-value" v-model="newFieldValue" class="createclientform__input" />
        </div>
  
        <button @click="addCustomField" class="createclientform__button--add-field formSubmitbutton">Add Field</button>
      </div>
  
      <button @click="showNewField = true" v-if="!showNewField" class="createclientform__button createclientform__button--add-field formSubmitbutton">Add Custom Field</button>
      <button @click="submitForm" class="createclientform__button createclientform__button--submit formSubmitbutton">Submit</button>
    </div>
  </template>
  
  <script>
  import { mapActions, mapState, mapMutations } from 'vuex';

  import urlMixin from '@/mixins/url.js';
  import authMixin from '@/mixins/auth.js';

  export default {
    data() {
      return {
        email: '',
        phonenumber: '',
        password: '',
        verified: '',
        anonid: '',
        customFields: [],
        fieldNames: [],
        showNewField: false,
        newFieldName: '',
        newFieldValue: '',
      };
    },
    computed: {
        ...mapState({
          client: state => state.client.client,
          client_files: state => state.client.client_files,
          admin_token: state => state.auth.admin_token,
          admin: state => state.auth.admin
        }),
    },
    mounted() {
        const { anonId, email, password, phonenumber, verified } = this.client;

        this.anonid = anonId;
        this.email = email;
        this.password = password;
        this.phonenumber = phonenumber;
        this.verified = verified;
    },
    methods: {
        ...mapActions('client', [
            'editClient'
        ]),
        addCustomField() {
            if (this.newFieldName.trim() === '') {
                alert('Please enter a field name.');
                return;
            }
            this.customFields.push(this.newFieldValue);
            this.fieldNames.push(this.newFieldName);
            this.newFieldName = '';
            this.newFieldValue = '';
            this.showNewField = false;
        },
        submitForm() {
            if (this.validateForm()) {
                const customFieldsData = {};

                this.customFields.forEach((item, index) => {
                    customFieldsData[`${this.fieldNames[index]}`] = item;
                })
                const formData = {
                    anonid: this.anonid,
                    email: this.email,
                    password: this.password,
                    phonenumber: this.phonenumber,
                    verified: this.verified,
                    customFields: customFieldsData,
                    editedBy: this.admin._id
                };

                this.editClient({ formData, client_id: this.client._id, admin_token: this.admin_token }).then(data => {
                    alert('user updated')
                    console.log(data, 'updated here')
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        validateForm() {
            if (this.anonid.trim() === '') {
                alert('Please fill all fields properly.');
                return false;
            }

            if (this.email.trim() === '') {
                alert('Please fill all fields properly.');
                return false;
            }

            if (this.password.trim() === '') {
                alert('Please fill all fields properly.');
                return false;
            }

            if (!this.validateEmail(this.email)) {
                alert('Please fill all fields properly.');
                return false;
            }

            if (this.phonenumber.trim() === '') {
                alert('Please fill all fields properly.');
                return false;
            }

            if (this.verified === null) {
                alert('Please fill all fields properly.');
                return false;
            }

            return true;
        },
        validateEmail(email) {
            // Regular expression for validating email addresses
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
    },
  };
  </script>

  <style lang="scss" scoped>
  .createclientform {
    display: flex;
    flex-direction: column;
    padding-top: #{scaleValue(20)};

    &__h1 {
        @include h1;
        margin-bottom: #{scaleValue(30)};
    }

    &__custom {
        display: flex;
        flex-direction: column;
    }

    &__label {
        @include input-label-style;
    }

    &__input {
        @include input-style;
    }

    &__new {
        display: flex;
        align-items: center;
    }

    &__newfieldarea {
        display: flex;
        flex-direction: column;
        margin-right: #{scaleValue(20)};
    }

    &__button {
        width: $area-width;
        margin-top: #{scaleValue(20)};
    }

    &__button {

        &--add-field {
            width: #{scaleValue(160)};
            background: green;
            font-size: #{scaleValue(15)};
            margin: 0;
        }
    }
  }
  </style>
  