<template>
  <div class="popup cover">
    <div class="transactionstyle" v-if="wallet">
      <div class="popup__body transactionstyle__body">
        <div class="transactionstyle__subject">
          <div class="transactionstyle__subject--backbtn">
            <!--<svg
              viewBox="0 0 24 24"
              focusable="false"
              class="chakra-icon css-onkibi"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
              ></path>
            </svg>-->
          </div>
          <div class="transactionstyle__subject--name transactionstyle__subject--topbtns">
            <h3>
              Withdraw from <span class="capitalize">{{ wallet.walletType }} wallet</span>
            </h3>

            <div class="transactionstyle__subject--withdrawaloptions">
              <span
                @click.stop="withdrawalMethodToggle('paypal')"
                class="button"
                :class="{ currentmethod: withdrawalmthd === 'paypal' }"
                >Paypal</span
              >

              <span
                @click.stop="withdrawalMethodToggle('crypto')"
                class="button"
                :class="{ currentmethod: withdrawalmthd === 'crypto' }"
                >Crypto</span
              >

              <!--<span
                @click.stop="withdrawalMethodToggle('bank')"
                class="button"
                :class="{ currentmethod: withdrawalmthd === 'bank' }"
                >Bank</span
              >-->
            </div>
          </div>
          <div class="transactionstyle__subject--closebtn" @click="close">
            <svg
              viewBox="0 0 24 24"
              focusable="false"
              class="chakra-icon css-onkibi"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
              ></path>
            </svg>
          </div>
        </div>

        <div class="transactionstyle__container" v-if="assettowithdraw">
          <div class="transactionstyle__info">
            <div class="transactionstyle__info--header">
              <span>Withdrawal Info</span>
            </div>
            <div class="transactionstyle__info--text">
              <p>
                Enter the amount of
                <span class="gold-colored">{{ assettowithdraw.assetname }}</span> you
                would like to withdraw.
              </p>
            </div>
          </div>

          <div class="margin-up-down fontSize11 neon-blue">Fee: ${{ withdrawalfee }}</div>

          <div class="transactionstyle__inputbox">
            <div class="transactionstyle__inputboxarea">
              <div
                @click="toggledropdownvisible"
                class="transactionstyle__inputboxarea--section center-align reserveasset-label-area"
              >
                <figure class="reserveassetlogo" v-if="assettowithdraw">
                  <img :src="returnCryptoLogo(assettowithdraw.assetlogo)" />
                </figure>
                <span class="reserveassetlabel fontSize11">{{
                  assettowithdraw
                    ? addEllipsis(`${assettowithdraw.assetinitials}`, 8)
                    : ""
                }}</span>
              </div>

              <div
                class="transactionstyle__inputboxarea--section flex-direction-column flex-end-column"
              >
                <div class="transactionstyle__inputboxarea--inputsection">
                  <input
                    placeholder="Enter Amount"
                    v-model="withdrawalinput"
                    type="number"
                  />
                  <span></span>
                </div>
                <span class="amounttobuyinusd">≈ ${{ withamountUsd }}</span>
              </div>
            </div>

            <div class="transactionstyle__inputboxarea center-align">
              <div
                class="transactionstyle__inputboxarea--section flex-direction-column line-height-18"
              >
                <span class="balance neon-green"
                  >{{ assettowithdraw ? addEllipsis(`${assettowithdraw.blc}`, 13) : 0 }}
                  <span class="neon-blue fontSize10">{{
                    assettowithdraw ? assettowithdraw.assetinitials : ""
                  }}</span></span
                >

                <span class="balance-figure fontSize10 neon-pink"
                  >${{
                    assettowithdraw ? addEllipsis(`${assettowithdraw.usdblc}`, 13) : 0
                  }}</span
                >
              </div>
              <div class="transactionstyle__inputboxarea--section">
                <span class="percentpill neon-green" @click="selectwithdrawalpercent(25)"
                  >25%</span
                >
                <span class="percentpill neon-green" @click="selectwithdrawalpercent(50)"
                  >50%</span
                >
                <span class="percentpill neon-green" @click="selectwithdrawalpercent(75)"
                  >75%</span
                >
                <span class="percentpill neon-green" @click="selectwithdrawalpercent(100)"
                  >Max</span
                >
              </div>
            </div>
          </div>

          <div v-if="successMessage">
            <Done :successMessage="successMessage" :closeSuccess="closeSuccess" />
          </div>

          <div class="transactionstyle__container" v-if="withdrawdetails">
            <div class="transactionstyle__withdrawalassetdropdown">
              <div class="popup__body transactionstyle__body">
                <div class="transactionstyle__subject">
                  <div class="transactionstyle__subject--backbtn" @click="uninitwithdraw">
                    <svg
                      viewBox="0 0 24 24"
                      focusable="false"
                      class="chakra-icon css-onkibi"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                      ></path>
                    </svg>
                  </div>
                  <div class="transactionstyle__subject--name">
                    <h3>Make sure the information is accurate</h3>
                  </div>
                  <div class="transactionstyle__subject--closebtn" @click="close">
                    <!--<svg
                      viewBox="0 0 24 24"
                      focusable="false"
                      class="chakra-icon css-onkibi"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
                      ></path>
                    </svg>-->
                  </div>
                </div>

                <div class="transactionstyle__container">
                  <div class="previewtrade__content">
                    <div class="previewtrade__contentarea">
                      <div
                        class="previewtrade__contentitem"
                        v-for="preview in withdrawdetailspreview"
                      >
                        <div class="previewtrade__contentitemleft">{{ preview }}</div>
                        <div class="previewtrade__contentitemright capitalize">
                          {{ withdrawdetails[`${preview}`] }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="transactionstyle__btn">
                    <button
                      class="btn colored-btn padded-btn"
                      @click="withdraw"
                      v-if="!loading"
                    >
                      Confirm and Withdraw
                    </button>

                    <button class="btn colored-btn padded-btn dim" v-if="loading">
                      <span class="loader-button"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="addressinputopen && !withdrawdetails">
            <div class="auth__inputarea" v-if="withdrawalmthd === 'bank'">
              <label class="auth__inputarea--label withdrawal">
                <p>Bank</p>
                <p>*</p>
              </label>
              <span class="auth__inputarea--input withdrawal">
                <input v-model="withdrawalbank" ref="bank" class="withdrawal" />
              </span>
            </div>

            <div class="auth__inputarea" v-if="withdrawalmthd === 'crypto'">
              <label class="auth__inputarea--label withdrawal">
                <p>Crypto Address (make sure it's the right one)</p>
                <p>*</p>
              </label>
              <span class="auth__inputarea--input withdrawal">
                <input v-model="cryptoaddress" ref="cryptoaddress" class="withdrawal" />
              </span>
            </div>

            <div class="auth__inputarea" v-if="withdrawalmthd === 'paypal'">
              <label class="auth__inputarea--label withdrawal">
                <p>Paypal email</p>
                <p>*</p>
              </label>
              <span class="auth__inputarea--input withdrawal">
                <input
                  v-model="paypalemail"
                  type="email"
                  ref="paypalemail"
                  class="withdrawal"
                />
              </span>
            </div>

            <div class="auth__inputarea" v-if="withdrawalmthd === 'bank'">
              <label class="auth__inputarea--label withdrawal">
                <p>Account</p>
                <p>*</p>
              </label>
              <span class="auth__inputarea--input withdrawal">
                <input v-model="withdrawalaccount" ref="account" class="withdrawal" />
              </span>
            </div>
          </div>

          <div class="transactionstyle__withdrawalassetdropdown" v-if="dropdownvisible">
            <div class="popup__body transactionstyle__body">
              <div class="transactionstyle__subject">
                <div
                  class="transactionstyle__subject--backbtn"
                  @click="toggledropdownvisible"
                >
                  <svg
                    viewBox="0 0 24 24"
                    focusable="false"
                    class="chakra-icon css-onkibi"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                    ></path>
                  </svg>
                </div>
                <div class="transactionstyle__subject--name">
                  <h3>
                    Withdraw from
                    <span class="capitalize">{{ wallet.walletType }} wallet</span>
                  </h3>
                </div>
                <div class="transactionstyle__subject--closebtn" @click="close">
                  <svg
                    viewBox="0 0 24 24"
                    focusable="false"
                    class="chakra-icon css-onkibi"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
                    ></path>
                  </svg>
                </div>
              </div>

              <div class="transactionstyle__container">
                <div class="transactionstyle__info">
                  <div class="transactionstyle__info--header">
                    <span>Withdraw Info</span>
                  </div>
                  <div class="transactionstyle__info--text">
                    <p class="neon-blue">
                      Select the asset in your {{ wallet.walletType }} wallet to withdraw
                      from.
                    </p>
                  </div>

                  <div class="margin-up-down">
                    <div class="transactionstyle__selectassetcat">
                      <div
                        class="transactionstyle__selectassetcat--area"
                        @click="setcurrentassetcat('crypto')"
                      >
                        <figure>
                          <img src="https://assets.coincap.io/assets/icons/256/btc.png" />
                        </figure>
                        <span class="btn">
                          <button class="btn">Crypto</button>
                        </span>
                      </div>

                      <div
                        class="transactionstyle__selectassetcat--area"
                        @click="setcurrentassetcat('stock')"
                      >
                        <figure>
                          <img src="https://assets.coincap.io/assets/icons/rune@2x.png" />
                        </figure>
                        <span class="btn">
                          <button class="btn">Stock</button>
                        </span>
                      </div>

                      <div
                        class="transactionstyle__selectassetcat--area"
                        @click="setcurrentassetcat('commodity')"
                      >
                        <figure>
                          <img src="https://assets.coincap.io/assets/icons/rune@2x.png" />
                        </figure>
                        <span class="btn">
                          <button class="btn">Commodity</button>
                        </span>
                      </div>

                      <div
                        class="transactionstyle__selectassetcat--area"
                        @click="setcurrentassetcat('fiat')"
                      >
                        <figure>
                          <img
                            src="https://clipart-library.com/new_gallery/111-1111898_transparent-american-flag-icon.png"
                          />
                        </figure>
                        <span class="btn">
                          <button class="btn">Fiat</button>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="transactionstyle__withdrawalassetsdropdown">
                    <div class="transactionstyle__listitemsassets">
                      <div
                        class="transactionstyle__listitemsasset"
                        v-for="(asset, caindex) in assetslist"
                        @click="setassettowithdraw(asset)"
                      >
                        <figure class="assetlist__area--assetlogo">
                          <img :src="returnCryptoLogo(asset.assetlogo)" />
                        </figure>
                        <div class="transactionstyle__listitemsasset--labels">
                          <label class="name" v-if="asset.assetname">{{
                            asset.assetname
                          }}</label>
                          <label class="chain">{{ asset.assetinitials }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="transactionstyle__btn">
            <button
              class="btn colored-btn padded-btn"
              :class="{
                opacity,
              }"
              v-if="!allowwithdraw"
            >
              Withdraw
            </button>

            <button
              class="btn colored-btn padded-btn"
              v-if="allowwithdraw && !withdrawdetails"
              @click="initwithdraw"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BASE_VARS from "@/store/base_vars";

const { BASE_URL } = BASE_VARS;

import transactionpopup from "@/mixins/transactionpopup";
import walletMixin from "@/mixins/wallet";
import listMixin from "@/mixins/list";
import cryptologosMixin from "@/mixins/cryptologos";
import globalMixin from "@/mixins/global";

import { mapActions, mapMutations, mapState } from "vuex";

export default {
  data() {
    return {
      assettowithdraw: {},
      withdrawalinput: "0",
      withamountUsd: 0,
      paypalemail: "",
      cryptoaddress: "",
      dropdownvisible: false,
      addressinputopen: false,
      withdrawalbank: "",
      withdrawalaccount: "",
      withdrawdetails: null,
      loading: false,
      successMessage: null,
      withdrawalmthd: "bank",
      assetcat: "crypto",
      assetslist: [],
    };
  },
  props: ["close", "walletname"],
  mounted() {
    this.getassets();
  },
  mixins: [transactionpopup, walletMixin, listMixin, cryptologosMixin, globalMixin],
  computed: {
    ...mapState({
      spotwallet: (state) => state.userwallet.spotwallet,
      marginwallet: (state) => state.userwallet.marginwallet,
      client: (state) => state.auth.client,
    }),
    currentwallet() {
      const { spotwallet, marginwallet, currentpath } = this;

      if (currentpath === "fiat/spot") {
        return spotwallet;
      } else {
        return marginwallet;
      }
    },
    withdrawdetailspreview() {
      const { withdrawdetails } = this;

      const details = [];

      if (withdrawdetails) {
        for (let [key, value] of Object.entries(withdrawdetails)) {
          details.push(key);
        }

        return details;
      } else {
        return [];
      }
    },
    allowwithdraw() {
      if (!this.withdrawalinput) {
        return false;
      }

      if (this.assettowithdraw) {
        if (this.assettowithdraw.blc) {
          if (
            Number(this.withdrawalinput.replace(/,/g, "")) >
            Number(this.assettowithdraw.blc.replace(/,/g, ""))
          ) {
            return false;
          }
        }
      }

      if (this.withdrawalmthd === "bank") {
        if (!this.withdrawalaccount.length || !this.withdrawalbank.length) {
          return false;
        }
      }

      if (this.withdrawalmthd === "paypal") {
        if (!this.paypalemail.length) {
          return false;
        }
      }

      if (this.withdrawalmthd === "crypto") {
        if (!this.cryptoaddress.length) {
          return false;
        }
      }

      if (parseFloat(this.withdrawalinput) <= 0) {
        return false;
      }

      return true;
    },
    withdrawalfee() {
      const { withdrawalinput, assettowithdraw } = this;

      if (withdrawalinput && assettowithdraw.blc) {
        //console.log(parseFloat(withdrawalinput));
        return parseFloat(withdrawalinput) * 0.005;
      }

      return 0;
    },
  },
  watch: {
    withdrawalmthd() {
      this.paypalemail = "";
      this.withdrawalbank = "";
      this.cryptoaddress = "";
      this.withdrawalaccount = "";
    },
    paginatedList(newval, oldval) {
      if (newval.length) {
        this.assettowithdraw = this.paginatedList[0];
      }
    },
    withdrawalinput(newval, oldval) {
      if (newval) {
        this.withamountUsd =
          parseFloat(newval) * parseFloat(this.assettowithdraw.assetprice);
      }

      if (newval && parseFloat(newval) < parseFloat(this.assettowithdraw.blc)) {
        this.addressinputopen = true;
      } else {
        this.addressinputopen = false;
      }
    },
  },
  methods: {
    withdrawalMethodToggle(withdrawalmthd) {
      this.withdrawalmthd = withdrawalmthd;
    },
    closeSuccess() {
      this.successMessage = null;
      this.withdrawdetails = null;
    },
    async withdraw() {
      this.loading = true;

      try {
        const token = localStorage.getItem("873__jh6bdjktoken");

        const response = await fetch(`${BASE_URL}/userwallet/request/withdraw`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            asset: this.assettowithdraw.assetid,
            amount: this.withdrawalinput,
            usdamount: this.withamountUsd,
            Bank: this.withdrawalbank,
            Account: this.withdrawalaccount,
            cryptoaddress: this.cryptoaddress,
            paypalemail: this.paypalemail,
            wallet: this.currentwallet._id,
            wallettype: this.currentwallet.wallettype,
            user: this.currentwallet.owner,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        this.successMessage = "Withdrawal processing";
        this.loading = false;
        this.withdrawdetails = null;
        this.withdrawalinput = 0;

        this.withdrawalaccount = "";
        this.withdrawalbank = "";
      } catch (error) {
        console.error("Error creating market order:", error);
        // Handle or throw the error based on your use case
        throw error;
      }
    },
    initwithdraw() {
      if (this.withdrawalmthd === "bank") {
        this.withdrawdetails = {
          Asset: this.assettowithdraw.assetname,
          Amount: `${this.withdrawalinput}`,
          AmountUSD: `$${this.withamountUsd}`,
          Bank: this.withdrawalbank,
          Account: this.withdrawalaccount,
        };
      }

      if (this.withdrawalmthd === "paypal") {
        this.withdrawdetails = {
          Asset: this.assettowithdraw.assetname,
          Amount: `${this.withdrawalinput}`,
          AmountUSD: `$${this.withamountUsd}`,
          PaypalEmail: this.paypalemail,
        };
      }

      if (this.withdrawalmthd === "crypto") {
        this.withdrawdetails = {
          Asset: this.assettowithdraw.assetname,
          Amount: `${this.withdrawalinput}`,
          AmountUSD: `$${this.withamountUsd}`,
          CrytoAddress: this.cryptoaddress,
        };
      }
    },
    uninitwithdraw() {
      this.withdrawdetails = null;
    },
    selectwithdrawalpercent(percnt) {
      const { assettowithdraw } = this;

      if (percnt === 100) {
        const withdrawval =
          (parseFloat(percnt) / 100) * parseFloat(assettowithdraw.blc) * 0.98;

        this.withdrawalinput = `${withdrawval}`;

        return;
      }

      const withdrawval = (parseFloat(percnt) / 100) * parseFloat(assettowithdraw.blc);

      this.withdrawalinput = `${withdrawval}`;
    },
    toggledropdownvisible() {
      this.dropdownvisible
        ? (this.dropdownvisible = false)
        : (this.dropdownvisible = true);
    },
    setassettowithdraw(asset) {
      this.assettowithdraw = asset;
      this.withdrawalinput = 0;
      this.toggledropdownvisible();
    },

    setcurrentassetcat(assetcategory) {
      this.assetcat = assetcategory;

      this.getassets();
    },
    async getassets() {
      const { assetcat } = this;

      try {
        const token = localStorage.getItem("873__jh6bdjktoken");

        let walletid = this.currentwallet._id;

        if (token) {
          const response = await fetch(
            `${BASE_URL}/swap/getassets?walletid=${walletid}&assetype=${this.assetcat}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();
          const { walletassets_list } = data;

          //this.assets = walletassets_list;
          this.assetslist = walletassets_list;
          this.assettowithdraw = this.assetslist[0];
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
