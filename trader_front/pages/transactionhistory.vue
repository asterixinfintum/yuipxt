<template>
  <div>
    <div class="transactionhistory">
      <div class="content">
        <HeaderBox />

        <div class="transactionhistory__transaction" v-if="transaction_open">
          <div class="transactionhistory__transactionbody">
            <span class="transactionhistory__transactionclose">
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

            <div class="transactionhistory__transactionheader">
              <h3>Transaction Details</h3>
              <div></div>
            </div>

            <div class="transactionhistory__transactionlist">
              <div class="transactionhistory__transactionlistitem">
                <div class="transactionhistory__transactionlistitemarea">
                  <span class="opacity">Status</span>
                </div>
                <div class="transactionhistory__transactionlistitemarea status">
                  <span class="status statusgreen"></span>
                  <span class="">Completed</span>
                </div>
              </div>

              <div class="transactionhistory__transactionlistitem">
                <div class="transactionhistory__transactionlistitemarea">
                  <span class="opacity">Date</span>
                </div>
                <div class="transactionhistory__transactionlistitemarea status">
                  <span class="">2023-06-28 12:42</span>
                </div>
              </div>

              <div class="transactionhistory__transactionlistitem">
                <div class="transactionhistory__transactionlistitemarea">
                  <span class="opacity">Coin</span>
                </div>
                <div class="transactionhistory__transactionlistitemarea status">
                  <span class="">USDT</span>
                </div>
              </div>

              <div class="transactionhistory__transactionlistitem">
                <div class="transactionhistory__transactionlistitemarea">
                  <span class="opacity">Deposit amount</span>
                </div>
                <div class="transactionhistory__transactionlistitemarea status">
                  <span class="">175</span>
                </div>
              </div>

              <div class="transactionhistory__transactionlistitem">
                <div class="transactionhistory__transactionlistitemarea">
                  <span class="opacity">Network</span>
                </div>
                <div class="transactionhistory__transactionlistitemarea status">
                  <span class="">TRX</span>
                </div>
              </div>

              <div class="transactionhistory__transactionlistitem">
                <div class="transactionhistory__transactionlistitemarea">
                  <span class="opacity">Address</span>
                </div>
                <div class="transactionhistory__transactionlistitemarea status">
                  <span class="">TB7cxHB7jqfwN8fDmiQ7CQZcnREEcgkVBE</span>
                  <span class="svg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      class="css-h3gd8s"
                    >
                      <path
                        d="M6.379 8.5l-1.94 1.94a6.45 6.45 0 109.122 9.12l1.939-1.939-2.121-2.121-1.94 1.94a3.45 3.45 0 01-4.878-4.88L8.5 10.622 6.379 8.5zM12.56 6.56a3.45 3.45 0 014.88 4.88l-1.94 1.939 2.121 2.121 1.94-1.94a6.45 6.45 0 10-9.122-9.12L8.5 6.378 10.621 8.5l1.94-1.94z"
                        fill="currentColor"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.81 16.31l-2.12-2.12 6.5-6.5 2.12 2.12-6.5 6.5z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                  <span class="svg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      class="css-woosrk"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9 3h11v13h-3V6H9V3zM4 8v13h11V8.02L4 8z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                </div>
              </div>

              <div class="transactionhistory__transactionlistitem">
                <div class="transactionhistory__transactionlistitemarea">
                  <span class="opacity">TxID</span>
                </div>
                <div class="transactionhistory__transactionlistitemarea status">
                  <span class=""
                    >145fd31f9850d5968d68e32462ba8fa65c404b037bea9dbe5e403335c73ce9f0</span
                  >
                </div>
              </div>

              <div class="transactionhistory__transactionlistitem">
                <div class="transactionhistory__transactionlistitemarea">
                  <span class="opacity">Network</span>
                </div>
                <div class="transactionhistory__transactionlistitemarea status">
                  <span class="">TRX</span>
                </div>
              </div>

              <div class="transactionhistory__transactionlistitem">
                <div class="transactionhistory__transactionlistitemarea">
                  <span class="opacity">Wallet</span>
                </div>
                <div class="transactionhistory__transactionlistitemarea status">
                  <span class="">Spot</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="content__body">
          <div class="container">
            <SideNav />

            <div class="layout-stretch">
              <PageIndicator
                :page_name="'Transaction History'"
                :transparent="true"
                :nobtns="true"
              />

              <div class="layout-padding">
                <!--<div class="contentheader">
                                        <div class="contentheader__area">
                                            <div>
                                                <button class="btn padded-btn current contentheader__area--btn">Crypto</button>
                                                <button class="btn contentheader__area--btn notcurrent">Fiat</button>
                                                <button class="btn padded-btn contentheader__area--btn notcurrent">Transfer</button>
                                                <button class="btn contentheader__area--btn notcurrent">Distribution</button>
                                                <button class="btn padded-btn contentheader__area--btn notcurrent">Loan</button>
                                            </div>
                                        </div>
                                    </div>-->

                <!--<div class="sectiondropdowns">
                                        <div class="sectiondropdowns__area">
                                            <label class="sectiondropdowns__area--label">Type</label>
                                            <div class="sectiondropdowns__dropdown">
                                                <span class="sectiondropdowns__dropdown--content">
                                                    <span class="name">Deposit</span>
                                                    <span class="svg">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-rrv9q1"><path d="M16.5 8.49v2.25L12 15.51l-4.5-4.77V8.49h9z" fill=""></path></svg>
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="sectiondropdowns__area">
                                            <label class="sectiondropdowns__area--label">Time</label>
                                            <div class="sectiondropdowns__dropdown">
                                                <span class="sectiondropdowns__dropdown--content">
                                                    <span class="name">Past 30 Days</span>
                                                    <span class="svg">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-rrv9q1"><path d="M16.5 8.49v2.25L12 15.51l-4.5-4.77V8.49h9z" fill=""></path></svg>
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="sectiondropdowns__area">
                                            <label class="sectiondropdowns__area--label">Asset</label>
                                            <div class="sectiondropdowns__dropdown">
                                                <span class="sectiondropdowns__dropdown--content">
                                                    <span class="name">All</span>
                                                    <span class="svg">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-rrv9q1"><path d="M16.5 8.49v2.25L12 15.51l-4.5-4.77V8.49h9z" fill=""></path></svg>
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="sectiondropdowns__area">
                                            <label class="sectiondropdowns__area--label">Status</label>
                                            <div class="sectiondropdowns__dropdown">
                                                <span class="sectiondropdowns__dropdown--content">
                                                    <span class="name">All</span>
                                                    <span class="svg">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-rrv9q1"><path d="M16.5 8.49v2.25L12 15.51l-4.5-4.77V8.49h9z" fill=""></path></svg>
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="sectiondropdowns__area">
                                            <label class="sectiondropdowns__area--label">TxID</label>
                                            <div class="sectiondropdowns__dropdown">
                                                <span class="sectiondropdowns__dropdown--content">
                                                    <input :placeholder="'Enter TxID'" class="sectiondropdowns__input"/>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="sectiondropdowns__area link">
                                            <div class="sectiondropdowns__link">
                                                <p>Deposit hasn't arrived? Click here</p>
                                            </div>
                                        </div>

                                    </div>-->

                <div class="assetlistheader">
                  <div class="assetlistheader__item fiatandspot">
                    <label class="assetlistheader__item--label">Time</label>
                  </div>

                  <div class="assetlistheader__item fiatandspot">
                    <label class="assetlistheader__item--label">Type</label>
                  </div>

                  <div class="assetlistheader__item fiatandspot">
                    <label class="assetlistheader__item--label">Deposit Wallet</label>
                  </div>

                  <div class="assetlistheader__item fiatandspot">
                    <label class="assetlistheader__item--label">Asset</label>
                  </div>

                  <div class="assetlistheader__item fiatandspot">
                    <label class="assetlistheader__item--label">Amount</label>
                  </div>

                  <div class="assetlistheader__item fiatandspot">
                    <label class="assetlistheader__item--label">Destination</label>
                  </div>

                  <div class="assetlistheader__item fiatandspot">
                    <label class="assetlistheader__item--label">TxID</label>
                  </div>

                  <div class="assetlistheader__item fiatandspot">
                    <label class="assetlistheader__item--label">Status</label>
                  </div>
                </div>

                <div class="assetlist">
                  <div
                    class="assetlist__item fiatandspot"
                    v-for="transaction in transactions"
                  >
                    <div class="assetlist__area fiatandspot number-value opacity-dim">
                      <p>{{ transaction.time }}</p>
                    </div>

                    <div class="assetlist__area fiatandspot number-value opacity-dim">
                      <p>{{ transaction.type }}</p>
                    </div>

                    <div class="assetlist__area fiatandspot number-value opacity-dim">
                      <p>{{ transaction.wallet }}</p>
                    </div>

                    <div class="assetlist__area fiatandspot number-value opacity-dim">
                      <p>{{ transaction.asset }}</p>
                    </div>

                    <div class="assetlist__area fiatandspot number-value opacity-dim">
                      <p>{{ transaction.amount }}</p>
                    </div>

                    <div
                      class="assetlist__area fiatandspot number-value opacity-dim flex-svg"
                    >
                      <p>{{ transaction.destination }}</p>
                      <span class="svg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          class="css-h3gd8s"
                        >
                          <path
                            d="M6.379 8.5l-1.94 1.94a6.45 6.45 0 109.122 9.12l1.939-1.939-2.121-2.121-1.94 1.94a3.45 3.45 0 01-4.878-4.88L8.5 10.622 6.379 8.5zM12.56 6.56a3.45 3.45 0 014.88 4.88l-1.94 1.939 2.121 2.121 1.94-1.94a6.45 6.45 0 10-9.122-9.12L8.5 6.378 10.621 8.5l1.94-1.94z"
                            fill="currentColor"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M9.81 16.31l-2.12-2.12 6.5-6.5 2.12 2.12-6.5 6.5z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                      <span class="svg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          class="css-woosrk"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M9 3h11v13h-3V6H9V3zM4 8v13h11V8.02L4 8z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                    </div>

                    <div
                      class="assetlist__area fiatandspot number-value opacity-dim flex-svg"
                    >
                      <p>{{ transaction.transactionid }}</p>
                      <span class="svg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          class="css-h3gd8s"
                        >
                          <path
                            d="M6.379 8.5l-1.94 1.94a6.45 6.45 0 109.122 9.12l1.939-1.939-2.121-2.121-1.94 1.94a3.45 3.45 0 01-4.878-4.88L8.5 10.622 6.379 8.5zM12.56 6.56a3.45 3.45 0 014.88 4.88l-1.94 1.939 2.121 2.121 1.94-1.94a6.45 6.45 0 10-9.122-9.12L8.5 6.378 10.621 8.5l1.94-1.94z"
                            fill="currentColor"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M9.81 16.31l-2.12-2.12 6.5-6.5 2.12 2.12-6.5 6.5z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                      <span class="svg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          class="css-woosrk"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M9 3h11v13h-3V6H9V3zM4 8v13h11V8.02L4 8z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                    </div>

                    <div class="assetlist__area fiatandspot number-value opacity-dim">
                      <p>{{ transaction.status }}</p>
                    </div>
                  </div>

                  <!-- <div class="assetlist__navigation">
                                            <span class="assetlist__navigation--prev">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-3kwgah"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.934 12l3.89 3.89-1.769 1.767L8.398 12l1.768-1.768 3.89-3.889 1.767 1.768-3.889 3.89z" fill="currentColor"></path></svg>
                                            </span>
                                            <span class="current">1</span>
                                            <span>2</span>
                                            <span>3</span>
                                            <span>...</span>
                                            <span class="assetlist__navigation--next">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-3kwgah"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.288 12l-3.89 3.89 1.768 1.767L15.823 12l-1.768-1.768-3.889-3.889-1.768 1.768 3.89 3.89z" fill="currentColor"></path></svg>
                                            </span>
                                        </div>-->
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
import { mapActions, mapMutations, mapState } from "vuex";

import BASE_VARS from "@/store/base_vars";

import socket from "@/plugins/socket.js";

const { BASE_URL } = BASE_VARS;

export default {
  data() {
    return {
      transaction_open: false,
      transactions: [],
    };
  },
  methods: {
    async gettransactions() {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");

        if (token) {
          const response = await fetch(
            `${BASE_URL}/userwallet/transactions?userid=${this.client._id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (data) {
            this.transactions = data.transactions;
          }
        }
      } catch (error) {
        throw error;
      }
    },
  },
  mounted() {
    if (this.client) {
      this.gettransactions();
    }

    socket.on("updateuserdetail", (data) => {
      if (this.client) {
        if (this.client._id === data.userid) {
          this.gettransactions();
        }
      }
    });
  },
  watch: {
    client(newval, oldval) {
      if (newval) {
        this.gettransactions();
      }
    },
  },
  computed: {
    ...mapState({
      client: (state) => state.auth.client,
    }),
  },
};
</script>

<style lang="scss">
.transactionhistory {
  &__transaction {
    @include popup-parent;
  }

  &__transactionbody {
    @include popup-body;
    width: #{scaleValue(700)};
  }

  &__transactionclose {
    @include popup-close;
  }

  &__transactionheader {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  &__transactionlist {
    width: 100%;
    margin-top: #{scaleValue(35)};
  }

  &__transactionlistitem {
    display: flex;
    justify-content: space-between;
    font-size: #{scaleValue(12)};
    margin-bottom: #{scaleValue(16)};
  }

  &__transactionlistitemarea {
    font-size: #{scaleValue(14)};

    & span {
      display: inline-block;

      &.opacity {
        opacity: 0.6;
        font-weight: 600;
      }

      &.status {
        border-radius: 100%;
        height: #{scaleValue(10)};
        width: #{scaleValue(10)};
      }

      &.statusgreen {
        background: $success;
      }
    }
  }
}
</style>
