<template>
  <div>
    <div class="verification">
      <div class="content">
        <HeaderBox />

        <div class="verification__popup" v-if="currentStep === 'step 1'">
          <div class="verification__popup--body">
            <span class="verification__popup--close" @click="closepopup">
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
            <h3 class="verification__popup--h3">Step 1: Upload Document</h3>

            <div class="verification__filepreview" v-if="verification_file">
              <span>Chosen File:</span>
              <span>{{ verification_file.name }}</span>
            </div>

            <div class="verification__upload">
              <label for="fileInput" class="verification__upload--input">
                <p>Click to Choose a document</p>
                <input
                  type="file"
                  ref="fileInput"
                  @change="onFileChange"
                  id="fileInput"
                  class="verification__upload--input"
                />
              </label>
              <button
                v-if="verification_file"
                @click="callFileUpload"
                class="verification__upload--btn btn padded-btn colored-btn"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div class="verification__popup" v-if="currentStep === 'step 2'">
          <div class="verification__popup--body">
            <span class="verification__popup--close" @click="closepopup">
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
            <div class="verification__popup--permissionproceed">
              <span>Step 2:</span>
              <span>To proceed with verification, we need some live photos of you</span>
              <span>
                <button
                  @click="setStep(2)"
                  class="verification__upload--btn btn padded-btn colored-btn"
                >
                  Proceed
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="first"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12.288 12l-3.89 3.89 1.768 1.767L15.823 12l-1.768-1.768-3.889-3.889-1.768 1.768 3.89 3.89z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="second"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12.288 12l-3.89 3.89 1.768 1.767L15.823 12l-1.768-1.768-3.889-3.889-1.768 1.768 3.89 3.89z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </button>
              </span>
            </div>
          </div>
        </div>

        <div class="verification__popup" v-if="currentStep === 'step 3'">
          <div class="verification__popup--body">
            <span class="verification__popup--close" @click="closepopup">
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

            <h3 class="verification__popup--h3">
              Make sure your face is centered in the circle and the environment is well
              lit
            </h3>

            <div class="verification__popup--webcam">
              <Webcam :setStep="setStep" />
            </div>
          </div>
        </div>

        <div class="verification__popup" v-if="currentStep === 'step 4'">
          <div class="verification__popup--body">
            <span class="verification__popup--close" @click="closepopup">
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

            <div class="verification__popup--permissionproceed">
              <div v-if="!videoRecorderShown">
                <span>Step 3</span>
                <span>You'll need to hold your passport/driver's licence</span>
                <span>near your face with the data page facing the screen while</span>
                <span>the verifier takes a 10 sec video of you</span>
              </div>

              <span v-if="!videoRecorderShown">
                <button
                  @click="showvideoRecorder"
                  class="verification__upload--btn btn padded-btn colored-btn"
                >
                  Understood proceed
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="first"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12.288 12l-3.89 3.89 1.768 1.767L15.823 12l-1.768-1.768-3.889-3.889-1.768 1.768 3.89 3.89z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="second"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12.288 12l-3.89 3.89 1.768 1.767L15.823 12l-1.768-1.768-3.889-3.889-1.768 1.768 3.89 3.89z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </button>
              </span>

              <div v-if="videoRecorderShown">
                <span>Step 3</span>
                <span>Video recording...</span>
              </div>

              <div class="verification__popup--webcam" v-if="videoRecorderShown">
                <VideoVerifier :setStep="setStep" />
              </div>
            </div>
          </div>
        </div>

        <div
          class="verification__popup"
          v-if="currentStep === 'step 5'"
          @click="closepopup"
        >
          <div class="verification__popup--body">
            <span class="verification__popup--close">
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

            <div class="verification__popup--permissionproceed">
              <span>Steps Completed</span>
              <span class="thankyou"
                >Thank you for providing the necessary information for your Know Your
                Customer (KYC) verification. We appreciate your cooperation and
                understanding as we ensure the safety and security of our services. Our
                team will now review the provided information to complete the verification
                process.</span
              >
              <span class="thankyou"
                >Please note that the verification process may take some time, and we will
                notify you promptly once it is completed. If any additional information is
                required, we will reach out to you using the contact details you
                provided.</span
              >
              <span class="thankyou"
                >We value your privacy and assure you that all the information you have
                shared will be treated with the utmost confidentiality and in compliance
                with relevant data protection laws.</span
              >
              <span class="thankyou"
                >Thank you for choosing our services. Should you have any further
                questions or concerns, please don't hesitate to reach out to our customer
                support team.</span
              >

              <span>
                <button
                  class="verification__upload--btn btn padded-btn colored-btn"
                  @click="closepopupAndFinish"
                >
                  Finish
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="first"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12.288 12l-3.89 3.89 1.768 1.767L15.823 12l-1.768-1.768-3.889-3.889-1.768 1.768 3.89 3.89z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="second"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12.288 12l-3.89 3.89 1.768 1.767L15.823 12l-1.768-1.768-3.889-3.889-1.768 1.768 3.89 3.89z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </button>
              </span>
            </div>
          </div>
        </div>

        <div class="content__body">
          <div class="container">
            <SideNav />

            <div class="layout-stretch" v-if="client">
              <PageIndicator :page_name="'TradexQuant Identification'" :nobtns="true" />

              <div class="layout-padding">
                <div class="verification__user">
                  <div class="verification__userdetails">
                    <figure class="verification__userdetail--img">
                      <img src="@/assets/imgs/blank-profile-pic.webp" />
                    </figure>
                    <div class="verification__userdetail">
                      <div class="verification__userdetail--userid">
                        <p>Anonymous-User-{{ client.anonId }}</p>
                      </div>
                      <div
                        class="verification__userdetail--verified"
                        v-if="client.verified"
                      >
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            class="css-ujzvcj"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M7.035 16.812l-.001.002 2.121 2.121.002-.002 2.121-2.12 9.19-9.192-2.12-2.121-9.191 9.19-3.536-3.534-2.121 2.12 3.535 3.536z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </span>
                        <span class="text"> Verified </span>
                      </div>

                      <div class="underlinelink">Contact Support</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="verification__area">
                <div class="verification__reminderarea">
                  <div class="verification__reminder">
                    <div class="verification__reminder--warningsvg">
                      <span class="verification__reminder--warningsvg--svg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 96 96"
                          fill="none"
                          class="css-1ugebgo"
                        >
                          <path
                            fill-rule="#204db0"
                            clip-rule="evenodd"
                            d="M88 48c0 22.091-17.909 40-40 40S8 70.091 8 48 25.909 8 48 8s40 17.909 40 40z"
                            fill="#204db0"
                          ></path>
                          <path
                            d="M48 19c16.016 0 29 12.984 29 29S64.016 77 48 77 19 64.016 19 48s12.984-29 29-29z"
                            fill="#204db0"
                          ></path>
                          <path
                            d="M45 66h6v-6h-6v6zM51 54V30h-6v24h6z"
                            fill="#14151A"
                          ></path>
                          <defs>
                            <linearGradient
                              id="general-warning_svg__paint0_linear_22059_28207"
                              x1="8"
                              y1="48"
                              x2="102.5"
                              y2="48"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stop-color="#F0B90B" stop-opacity="0"></stop>
                              <stop offset="1" stop-color="#F0B90B"></stop>
                            </linearGradient>
                            <linearGradient
                              id="general-warning_svg__paint1_linear_22059_28207"
                              x1="77"
                              y1="48"
                              x2="19"
                              y2="48"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stop-color="#F0B90B"></stop>
                              <stop offset="1" stop-color="#F8D33A"></stop>
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                    </div>

                    <h3 class="verification__reminder--h3">Action Required</h3>

                    <div class="verification__reminder--text">
                      <p>
                        Please upload a new ID document before it expires, or your Binance
                        account will be restricted to “Withdrawal Only” 30 days after the
                        expiration date.
                      </p>
                    </div>

                    <div class="verification__reminder--action">
                      <button
                        class="verification__reminder--action--btn btn colored-btn padded-btn"
                        @click="openpopup(`passport`)"
                      >
                        Get Verified with passport
                      </button>
                      <button
                        class="verification__reminder--action--btn btn colored-btn padded-btn"
                        @click="openpopup(`driver's licence`)"
                      >
                        Get Verified with driver's licence
                      </button>
                    </div>
                  </div>

                  <div class="verification__reminder blur">
                    <h3 class="verification__reminder--h3">
                      Upgrade to increase your limits to 2M USD Daily.
                    </h3>

                    <div class="verification__reminder--text">
                      <p>
                        Please upload a new ID document before it expires, or your Binance
                        account will be restricted to “Withdrawal Only” 30 days after the
                        expiration date.
                      </p>
                    </div>

                    <div class="verification__reminder--action">
                      <button
                        class="verification__reminder--action--btn btn padded-btn greyed-btn"
                        @click="popupAction(action)"
                      >
                        Get Verified Plus
                      </button>
                    </div>
                  </div>
                </div>

                <div class="verification__levels">
                  <h3 class="verification__levels--h3">Verification Levels</h3>

                  <div class="verification__levelsbody">
                    <div class="verification__level">
                      <div class="verification__level--header">
                        <span class="verification__level--tick">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            class="css-ujzvcj"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M7.035 16.812l-.001.002 2.121 2.121.002-.002 2.121-2.12 9.19-9.192-2.12-2.121-9.191 9.19-3.536-3.534-2.121 2.12 3.535 3.536z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </span>
                        <span class="verification__level--h4">
                          <h4 class="success-text">Verified</h4>
                        </span>
                      </div>

                      <div class="verification__levelh3">
                        <h3>Limit of 50K USD Daily</h3>
                      </div>

                      <div class="verification__levellistarea">
                        <h4 class="verification__levellistarea--h4">Verified:</h4>

                        <ul class="verification__levellist">
                          <li>Personal information</li>
                          <li>Government-issued ID</li>
                          <li>Facial recognition</li>
                        </ul>
                      </div>
                    </div>

                    <div class="verification__level">
                      <div class="verification__level--header">
                        <span class="verification__level--tick not">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            class="css-ujzvcj"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M7.035 16.812l-.001.002 2.121 2.121.002-.002 2.121-2.12 9.19-9.192-2.12-2.121-9.191 9.19-3.536-3.534-2.121 2.12 3.535 3.536z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </span>
                        <span class="verification__level--h4">
                          <h4 class="success-text dull-text">Verified</h4>
                        </span>
                      </div>

                      <div class="verification__levelh3">
                        <h3>Limit of 50K USD Daily</h3>
                      </div>

                      <div class="verification__levellistarea">
                        <h4 class="verification__levellistarea--h4">Verified Plus:</h4>

                        <ul class="verification__levellist">
                          <li>Personal information</li>
                          <li>Government-issued ID</li>
                          <li>Facial recognition</li>
                        </ul>
                      </div>
                    </div>

                    <div class="verification__level">
                      <div class="verification__level--header">
                        <span class="verification__level--tick not">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            class="css-ujzvcj"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M7.035 16.812l-.001.002 2.121 2.121.002-.002 2.121-2.12 9.19-9.192-2.12-2.121-9.191 9.19-3.536-3.534-2.121 2.12 3.535 3.536z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </span>
                        <span class="verification__level--h4">
                          <h4 class="success-text dull-text">Verified</h4>
                        </span>
                      </div>

                      <div class="verification__levelh3">
                        <h3>Limit of 50K USD Daily</h3>
                      </div>

                      <div class="verification__levellistarea">
                        <h4 class="verification__levellistarea--h4">Verified Plus:</h4>

                        <ul class="verification__levellist">
                          <li>Personal information</li>
                          <li>Government-issued ID</li>
                          <li>Facial recognition</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="layout-padding">
                <div class="verification__info">
                  <h3 class="verification__info--h3">Account Limits</h3>

                  <div class="verification__infoitems">
                    <div class="verification__infoitem">
                      <span class="opacity4">Withdrawal Limits</span>
                      <span class="opacity7">50K USD Daily</span>
                    </div>

                    <div class="verification__infoitem">
                      <span class="opacity4">Crypto Deposit Limit</span>
                      <span class="opacity7">Unlimited</span>
                    </div>

                    <div class="verification__infoitem">
                      <span class="opacity4">Crypto Withdrawal Limit</span>
                      <span class="opacity7">8M BUSD Daily</span>
                    </div>

                    <div class="verification__infoitem">
                      <span class="opacity4">P2P Transaction Limits</span>
                      <span class="opacity7">Unlimited</span>
                    </div>
                  </div>
                </div>

                <div class="verification__info">
                  <h3 class="verification__info--h3">Personal information</h3>

                  <div class="verification__infoitems">
                    <div class="verification__infoitem">
                      <span class="opacity4">Legal Name</span>
                      <span class="opacity7">50K USD Daily</span>
                    </div>

                    <div class="verification__infoitem">
                      <span class="opacity4">Date of Birth</span>
                      <span class="opacity7">50K USD Daily</span>
                    </div>

                    <div class="verification__infoitem">
                      <span class="opacity4">Address</span>
                      <span class="opacity7">50K USD Daily</span>
                    </div>

                    <div class="verification__infoitem">
                      <span class="opacity4">Identification Documents</span>
                      <span class="opacity7">50K USD Daily</span>
                    </div>

                    <div class="verification__infoitem">
                      <span class="opacity4">Email Address</span>
                      <span class="opacity7">50K USD Daily</span>
                    </div>
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
import generalutilities from "@/mixins/generalutilities.js";
import auth from "@/mixins/auth.js";
import client from "@/mixins/client.js";
import transactionpopup from "@/mixins/transactionpopup.js";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      popup: true,
      file: null,
      uploadProgress: 0,
      currentStep: null,
      verificationSteps: ["step 1", "step 2", "step 3", "step 4", "step 5"],
      verificationmethod: null,
      videoRecorderShown: false,
    };
  },
  mixins: [generalutilities, auth, client, transactionpopup],
  methods: {
    ...mapMutations("verification", ["SET_FILE"]),
    ...mapActions("verification", ["uploadFile"]),
    openpopup(verificationmethod) {
      this.verificationmethod = verificationmethod;
      this.currentStep = this.verificationSteps[0];
    },
    closepopup() {
      this.verificationmethod = null;
      this.currentStep = null;
    },
    closepopupAndFinish() {
      this.verificationmethod = null;
      this.currentStep = null;

      window.close();
    },
    showvideoRecorder() {
      this.videoRecorderShown = true;
    },
    setStep(step) {
      this.currentStep = this.verificationSteps[step];
    },
    onFileChange(event) {
      this.file = event.target.files[0];

      this.SET_FILE(this.file);
    },
    callFileUpload() {
      const { verification_file, client } = this;

      this.uploadFile({ file: verification_file, client_id: client._id })
        .then((responseData) => {
          this.setStep(1);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {
    ...mapState({
      client: (state) => state.auth.client,
      verification_file: (state) => state.verification.verification_file,
      upload_progress: (state) => state.verification.upload_progress,
      uploaded_verification_file_details: (state) =>
        state.verification.uploaded_verification_file_details,
    }),
  },
  watch: {
    verification_file(newVal, oldVal) {
      //console.log(newVal, oldVal);
    },
    currentStep(newVal, oldVal) {
      if (newVal === this.verificationSteps[4]) {
        this.videoRecorderShown = false;
        this.verificationmethod = null;
      }
    },
  },
};
</script>

<style lang="scss">
.verification {
  &__user {
    display: flex;
    align-items: center;
    border-bottom: $border;
    padding-bottom: #{scaleValue(40)};
  }

  &__userdetails {
    display: flex;
  }

  &__userdetail {
    display: flex;
    flex-direction: column;

    &--img {
      overflow: hidden;
      border-radius: 100%;
      height: #{scaleValue(60)};
      width: #{scaleValue(60)};

      margin-right: #{scaleValue(15)};

      & img {
        object-fit: cover;
        height: 100%;
        width: 100%;
      }
    }

    &--userid {
      font-weight: 500;
      font-size: #{scaleValue(20)};
    }

    &--verified {
      color: $green;
      background: rgba($green, 0.1);
      padding: #{scaleValue(8)};
      font-size: #{scaleValue(13)};
      border-radius: #{scaleValue(6)};
      display: flex;
      align-items: center;
      width: #{scaleValue(89)};
      margin-top: #{scaleValue(7)};

      margin-bottom: #{scaleValue(30)};

      & span {
        display: flex;
        align-items: center;
        margin-right: #{scaleValue(5)};

        &.text {
          font-weight: 600;
        }

        & svg {
          height: #{scaleValue(15)};
          width: #{scaleValue(15)};
        }
      }
    }
  }

  &__area {
    display: flex;
  }

  &__reminderarea {
    display: flex;
    flex-direction: column;
    margin-right: #{scaleValue(100)};
  }

  &__reminder {
    @include popup-body;
    align-items: flex-start;
    margin-left: #{scaleValue(30)};
    width: #{scaleValue(800)};
    background: $blur-primary;

    &.blur {
      background: $blur;
    }

    &:not(:last-child) {
      margin-bottom: #{scaleValue(30)};
    }

    &--h3 {
      font-weight: 500;
      font-size: #{scaleValue(15)};
    }

    &--warningsvg {
      margin: 0 auto;

      &--svg {
        & svg {
          height: #{scaleValue(80)};
          width: #{scaleValue(80)};
          fill: $primary-color;
        }
      }
    }

    &--text {
      font-size: #{scaleValue(15)};
      line-height: #{scaleValue(21)};
      margin-top: #{scaleValue(10)};
      margin-bottom: #{scaleValue(30)};
    }

    &--action {
      &--btn {
        width: #{scaleValue(400)};
        font-size: #{scaleValue(15)};
        margin-bottom: #{scaleValue(15)};
      }
    }
  }

  &__levels {
    &--h3 {
      font-weight: 500;
      font-size: #{scaleValue(19)};
      margin-bottom: #{scaleValue(25)};
    }
  }

  &__levelsbody {
  }

  &__level {
    margin-bottom: #{scaleValue(30)};

    &--header {
      display: flex;
      align-items: center;

      & span {
        display: flex;
        align-items: center;
      }
    }

    &--tick {
      border-radius: 100%;
      background: $green;
      margin-right: #{scaleValue(10)};
      height: #{scaleValue(14)};
      width: #{scaleValue(14)};
      justify-content: center;

      &.not {
        background: $greyed-out;
      }

      & svg {
        height: #{scaleValue(12)};
        width: #{scaleValue(12)};
      }
    }

    &--h4 {
      & h4 {
        font-size: #{scaleValue(12)};
        font-weight: 500;
      }
    }
  }

  &__levelh3 {
    margin-top: #{scaleValue(12)};

    & h3 {
      font-size: #{scaleValue(14.5)};
      font-weight: 400;
    }
  }

  &__levellistarea {
    margin-top: #{scaleValue(20)};

    &--h4 {
      opacity: 0.6;
      font-weight: 400;
      margin-bottom: #{scaleValue(10)};
      font-size: #{scaleValue(14)};
    }
  }

  &__levellist {
    & li {
      margin-bottom: #{scaleValue(5)};
      opacity: 0.6;
      font-size: #{scaleValue(12.5)};
      transform: translateX(#{scaleValue(14)});
    }
  }

  &__info {
    width: #{scaleValue(800)};
    border-top: $border;
    padding: #{scaleValue(20)} 0;

    &--h3 {
      font-size: #{scaleValue(18)};
      margin-bottom: #{scaleValue(27)};
    }
  }

  &__infoitems {
  }

  &__infoitem {
    font-size: #{scaleValue(12.5)};
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: #{scaleValue(20)};

    & span {
      display: inline-block;

      &.opacity4 {
        font-weight: 400;
        opacity: 0.4;
      }

      &.opacity7 {
        font-weight: 500;
        opacity: 0.7;
      }
    }
  }

  &__popup {
    @include popup-parent;

    &--body {
      @include popup-body;
      align-items: flex-start;
    }

    &--close {
      @include popup-close;
    }

    &--h3 {
      font-weight: 400;
      font-size: #{scaleValue(15)};
      margin-bottom: #{scaleValue(40)};
      width: 100%;

      & span {
        display: block;
        margin: #{scaleValue(3)} 0;

        &:nth-child(1) {
          margin-bottom: #{scaleValue(15)};
        }

        & button {
          display: flex;
          align-items: center;
        }

        & svg {
          height: #{scaleValue(15)};
          width: #{scaleValue(15)};
        }
      }
    }

    &--permissionproceed {
      font-weight: 400;
      font-size: #{scaleValue(16)};
      margin-bottom: #{scaleValue(40)};
      width: 100%;

      & span {
        display: block;
        margin: #{scaleValue(3)} 0;

        &:nth-child(1) {
          margin-bottom: #{scaleValue(15)};
        }

        &.thankyou {
          font-size: #{scaleValue(15)};
          line-height: #{scaleValue(27)};

          &:not(:last-child) {
            margin-bottom: #{scaleValue(30)};
          }
        }

        & button {
          display: flex;
          align-items: center;
          font-size: #{scaleValue(16)};

          padding: #{scaleValue(12)} #{scaleValue(16)};
        }

        & svg {
          height: #{scaleValue(15)};
          width: #{scaleValue(15)};
          display: inline-block;

          &.second {
            transform: translateX(#{scaleValue(-11)});
          }
        }
      }
    }

    &--webcam {
      width: 100%;
    }
  }

  &__upload {
    display: flex;
    flex-direction: column;

    &--input {
      display: inline-block;
      padding: #{scaleValue(15)} #{scaleValue(40)};
      cursor: pointer;
      background-color: $primary-color;
      color: #fff;
      border-radius: #{scaleValue(10)};
      border: none;

      & p {
        font-weight: 500;
        font-size: #{scaleValue(15.5)};
      }

      & input[type="file"] {
        display: none;
      }
    }

    &--btn {
      margin-top: #{scaleValue(15.5)};
    }
  }

  &__filepreview {
    margin-bottom: #{scaleValue(15.5)};
    font-size: #{scaleValue(15.5)};
  }
}
</style>
