<template>
  <div>
    <div class="walletdeposit">
      <div class="content">
        <HeaderBox />

        <div class="content__body">
          <div class="container">
            <SideNav />

            <div class="layout-stretch">
              <PageIndicator
                :page_name="'Deposit Crypto'"
                :transparent="true"
                :nobtns="true"
              />

              <div class="layout-padding">
                <div class="walletdeposit__content">
                  <div class="walletdeposit__contentarea">
                    <div class="walletdeposit__select walletdeposit__selected">
                      <div class="walletdeposit__selectarea selected">
                        <figure class="selected-img">
                          <img src="@/assets/imgs/btc.png" />
                        </figure>
                        <label class="selected-symbol">BTC</label>

                        <label class="selected-name">Bitcoin</label>
                      </div>
                    </div>

                    <div class="layout-padding-2"></div>

                    <div class="walletdeposit__selectednetwork">
                      <div class="walletdeposit__networklist">
                        <div class="walletdeposit__networkarea">
                          <label class="label">BTC</label>
                          <label class="name">Bitcoin Network</label>
                        </div>
                      </div>
                    </div>

                    <h2 class="walletdeposit__content--h2">Deposit Address</h2>

                    <div
                      class="walletdeposit__address"
                      v-if="btcaddress !== 'Wallet not found' && btcaddress !== null"
                    >
                      <div class="walletdeposit__address--body">
                        <p class="walletdeposit__address--header">Address</p>
                        <p class="walletdeposit__address--addrstring">{{ btcaddress }}</p>
                      </div>

                      <span class="walletdeposit__address--copysvg" @click="copyAddress">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          class="css-p5ejok"
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
                      class="walletdeposit__address"
                      v-if="btcaddress === 'Wallet not found' || btcaddress === null"
                    >
                      <div class="walletdeposit__address--body">
                        <p class="walletdeposit__address--header">Address</p>
                        <p class="walletdeposit__address--addrstring loader-button"></p>
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
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      deposit_asset: null,
      deposit_network: null,
    };
  },
  methods: {
    ...mapActions("wallet", ["getwallets"]),
    selectAsset(asset) {
      this.deposit_asset = asset;
    },
    selectNetwork(network) {
      this.deposit_network = network;
    },
    copyAddress() {
      const textToCopy = this.btcaddress;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          alert("Deposit address has been copied!");
        })
        .catch(function (error) {
          alert("Unable to copy text: " + error);
        });
    },
  },
  mounted() {
    this.getwallets();
  },
  computed: {
    ...mapState({
      client: (state) => state.auth.client,
      bitcoinWallets: (state) =>
        state.auth.client ? state.auth.client.userWalletsBTC : [],
      client_token: (state) => state.auth.client_token,
      wallettypes: (state) => state.wallet.wallettypes,
      wallets: (state) => state.wallet.wallets,
    }),
    btcaddress() {
      const { wallets, currentpath } = this;
      let btcaddress;

      /*if (wallets.length) {
                if (currentpath === 'fiatandspot') {
                    const btcwllt = wallets.find(wallet => wallet.walletType === 'fiat/spot');
                    btcaddress = btcwllt.bitcoinAddress;
                    return btcaddress
                }

                if (currentpath === 'margin') {
                    const btcwllt = wallets.find(wallet => wallet.walletType === 'margin');
                    btcaddress = btcwllt.bitcoinAddress;
                    return btcaddress
                }
            }*/

      if (this.client) {
        if (currentpath === "fiatandspot") {
          return this.client.spotbtcaddress;
        }

        if (currentpath === "margin") {
          return this.client.marginbtcaddress;
        }
      }

      return null;
    },
    currentpath() {
      return this.$route.params.deposit;
    },
  },
};
</script>
