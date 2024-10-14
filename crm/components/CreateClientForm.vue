<template>
    <div class="createclientform">
      <h1 class="createclientform__h1">Add a contact here</h1>
      <label class="createclientform__label" for="first-name">First Name:</label>
      <input class="createclientform__input" type="text" id="first-name" v-model="firstName" />
  
      <label class="createclientform__label" for="last-name">Last Name:</label>
      <input class="createclientform__input" type="text" id="last-name" v-model="lastName" />
  
      <label class="createclientform__label" for="email">Email:</label>
      <input class="createclientform__input" type="email" id="email" v-model="email" />
  
      <label class="createclientform__label" for="phone">Phone:</label>
      <input class="createclientform__input" type="tel" id="phone" v-model="phone" />
  
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
  import urlMixin from '@/mixins/url.js';
  import authMixin from '@/mixins/auth.js';

  export default {
    props: ['page_path', ''],
    data() {
      return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        customFields: [],
        fieldNames: [],
        showNewField: false,
        newFieldName: '',
        newFieldValue: '',
      };
    },
    mixins: [urlMixin, authMixin],
    methods: {
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
            const { base_url, page_path, routeTo } = this;

            if (this.validateForm()) {
                const customFieldsData = {};

                this.customFields.forEach((item, index) => {
                    customFieldsData[`${this.fieldNames[index]}`] = item;
                })
                const formData = {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    phone: this.phone,
                    customFields: customFieldsData,
                };
                console.log(formData);
                const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQ1NjcyMWQ5MDA5Yzc0Yjk2NDdkZDcyIiwidXNlcm5hbWUiOiJtYWtlcmEyIiwiZW1haWwiOiJtYWtlcmEyQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjgzMzg2OTA5fQ.48t7HYabaOPAzmqTSa1te2sH4glmgV4ih_0_j5wLgCE"
                // TODO: send the form data to a server
                fetch(`${base_url}/${page_path}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => {
                    if (response.ok) {
                        alert('Form submitted successfully!');
                    } else {
                        throw new Error('Something went wrong.');
                    }
                })
                .catch(error => {
                    console.error(error);
                    alert('There was a problem submitting the form. Please try again later.');
                });
            }
        },
        validateForm() {
            if (this.firstName.trim() === '') {
                alert('Please enter your first name.');
                return false;
            }

            if (this.lastName.trim() === '') {
                alert('Please enter your last name.');
                return false;
            }

            if (this.email.trim() === '') {
                alert('Please enter your email address.');
                return false;
            }

            if (!this.validateEmail(this.email)) {
                alert('Please enter a valid email address.');
                return false;
            }

            if (this.phone.trim() === '') {
                alert('Please enter your phone number.');
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
  