<template>
  <div class="spottradearea">
    <div
      class="spottradearea__wallettype spottradearea__nav no-padding"
      v-if="walletType === 'fiat/spot'"
    >
      <div class="spottradearea__wallettype spottradearea__nav current">
        <h2>{{ walletTradingFrom }}</h2>
      </div>

      <div
        class="spottradearea__wallettype spottradearea__nav notcurrent"
        @click="toggleWallet('margin')"
      >
        <h2>Margin Trading</h2>
      </div>

      <div class="spottradearea__autotradetoggle">
        <label class="spottradearea__autotradetoggle--label"> Auto Trader </label>
        <div
          class="toggle-switch off"
          :class="{
            on: autoTrade === 'true',
          }"
          @click="toggleAutotrade"
        >
          <span
            class="toggle-switch-button"
            :class="{
              on: autoTrade === 'true',
              off: autoTrade === 'false',
            }"
          ></span>
        </div>
      </div>
    </div>

    <div
      class="spottradearea__wallettype spottradearea__nav no-padding"
      v-if="walletType === 'margin'"
    >
      <div
        class="spottradearea__wallettype spottradearea__nav notcurrent"
        @click="toggleWallet('spot')"
      >
        <h2>Spot</h2>
      </div>

      <div :class="{}" class="spottradearea__wallettype spottradearea__nav current">
        <h2>{{ walletTradingFrom }} Trading</h2>
      </div>

      <div class="spottradearea__autotradetoggle">
        <label class="spottradearea__autotradetoggle--label"> Auto Trader </label>
        <div
          class="toggle-switch off"
          :class="{
            on: autoTrade === 'true',
          }"
          @click="toggleAutotrade"
        >
          <span
            class="toggle-switch-button"
            :class="{
              on: autoTrade === 'true',
              off: autoTrade === 'false',
            }"
          ></span>
        </div>
      </div>
    </div>

    <div class="spottradearea__nav" v-if="walletType === 'margin'">
      <span
        class="spottradearea__nav--btn"
        :class="{
          current: margin === 'standard',
        }"
        @click="toggleMargin('standard')"
        >Standard</span
      >
      <span
        class="spottradearea__nav--btn"
        :class="{
          current: margin === '2X',
        }"
        @click="toggleMargin('2X')"
        >2X</span
      >
      <span
        class="spottradearea__nav--btn"
        :class="{
          current: margin === '3X',
        }"
        @click="toggleMargin('3X')"
        >3X</span
      >
      <span
        class="spottradearea__nav--btn"
        :class="{
          current: margin === '4X',
        }"
        @click="toggleMargin('4X')"
        >4X</span
      >
      <span
        class="spottradearea__nav--btn"
        :class="{
          current: margin === '5X',
        }"
        @click="toggleMargin('5X')"
        >5X</span
      >
    </div>

    <!--<div class="spottradearea__tradetypes" v-if="tradeInputView === 'spot'">
            <span class="spottradearea__tradetypes--btn current">Limit</span>
            <span class="spottradearea__tradetypes--btn">Market</span>
        </div>-->

    <div class="spottradearea__tradetypes" v-if="autoTrade !== 'true'">
      <span
        class="spottradearea__tradetypes--btn"
        :class="{
          current: orderType === 'market',
        }"
        @click="toggleOrderType('market')"
        >Market</span
      >
      <span
        class="spottradearea__tradetypes--btn"
        :class="{
          current: orderType === 'limit',
        }"
        @click="toggleOrderType('limit')"
        >Limit</span
      >
      <span
        class="spottradearea__tradetypes--btn"
        :class="{
          current: orderType === 'stop limit',
        }"
        @click="toggleOrderType('stop limit')"
        >Stop Limit</span
      >
    </div>

    <div class="spottradearea__fundaccount" v-if="fundaccount_popup">
      <div class="spottradearea__fundbody">
        <div class="spottradearea__head">
          <h2 class="spottradearea__head--h2">Fund Your Account</h2>
          <h3 class="spottradearea__head--h3">
            Select your preferred method to fund your account.
          </h3>
          <span class="spottradearea__head--close" @click="fundaccount_popup_toggle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              class="css-1iztezc"
            >
              <path
                d="M6.697 4.575L4.575 6.697 9.88 12l-5.304 5.303 2.122 2.122L12 14.12l5.303 5.304 2.122-2.122L14.12 12l5.304-5.303-2.122-2.122L12 9.88 6.697 4.575z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
        </div>

        <!--<div class="spottradearea__fundoption">
          <div class="spottradearea__fundoption--left">
            <h3 class="spottradearea__fundoption--h3">Internal Transfer</h3>
            <span class="spottradearea__fundoption--description"
              >Transfer from your internal wallet</span
            >
          </div>
          <div class="spottradearea__fundoption--right">
            <button class="spottradearea__fundoption--btn btn colored-btn">
              Transfer
            </button>
          </div>
        </div>-->

        <div class="spottradearea__fundoption">
          <div class="spottradearea__fundoption--left">
            <h3 class="spottradearea__fundoption--h3">Convert</h3>
            <span class="spottradearea__fundoption--description"
              >Convert from asset in wallet</span
            >
          </div>
          <div class="spottradearea__fundoption--right">
            <button class="spottradearea__fundoption--btn btn colored-btn" @click="$router.push('swap')">
              Convert
            </button>
          </div>
        </div>

        <div class="spottradearea__fundoption">
          <div class="spottradearea__fundoption--left">
            <h3 class="spottradearea__fundoption--h3">Send coin to Tradex Quant</h3>
            <span class="spottradearea__fundoption--description"
              >If you already hold some crypto currency, you can choose to transfer them
              to Tradex Quant via blockchain.</span
            >
          </div>
          <div class="spottradearea__fundoption--right">
            <button
              class="spottradearea__fundoption--btn btn colored-btn"
              @click="
                $router.push(
                  `/wallet/${wallet === 'margin' ? 'margin' : 'fiatandspot'}`
                )
              "
            >
              Deposit
            </button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <CreateOrder
        :asset="asset"
        :currentpair="currentpair"
        :orderType="orderType"
        :fundaccount_popup_toggle="fundaccount_popup_toggle"
        :openFundAccountPopup="openFundAccountPopup"
        :margin="margin"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ["asset", "walletTradingFrom", "currentpair"],
  mixins: [],
  data() {
    return {
      fundaccount_popup: false,
      tradeInputView: "create order", //spot, Margin, Agent, QuantX, Cross10x, create order,
      orderType: "market", //market, limit, take profit,
      margin: "standard",
    };
  },
  methods: {
    togggleTradeInputView(view) {
      this.tradeInputView = view;
    },
    toggleOrderType(type) {
      this.orderType = type;
    },
    fundaccount_popup_toggle() {
      if (this.fundaccount_popup) {
        return (this.fundaccount_popup = false);
      }

      this.fundaccount_popup = true;
    },
    openFundAccountPopup() {
      this.fundaccount_popup = true;
    },
    toggleAutotrade() {
      const { autoTrade } = this;
      let fullPath = this.$route.fullPath;

      if (autoTrade === "true") {
        fullPath = fullPath.replace(/true/g, "false");
      } else {
        fullPath = fullPath.replace(/false/g, "true");
      }

      this.$router.push({ path: fullPath, fullPath: true });
    },
    toggleWallet(wallet) {
      let fullPath = this.$route.fullPath;

      if (wallet === "spot") {
        fullPath = fullPath.replace(/margin/g, "spot");
      }

      if (wallet === "margin") {
        fullPath = fullPath.replace(/spot/g, "margin");
      }

      this.$router.push({ path: fullPath, fullPath: true });
    },
    toggleMargin(margin) {
      this.margin = margin;
    },
  },
  computed: {
    walletType() {
      const { walletTradingFrom } = this;

      if (walletTradingFrom === "spot") {
        return "fiat/spot";
      }

      if (walletTradingFrom === "margin") {
        return "margin";
      }
    },
    autoTrade() {
      const autotrade = this.$route.query.autotrader;

      return autotrade;
    },
  },
};
</script>
