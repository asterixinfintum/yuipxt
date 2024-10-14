<template>
  <div>
    <!-- TradingView Widget BEGIN -->
    <div class="tradingview-widget-container" :style="{ opacity }">
      <div class="tradingview-widget-container__widget"></div>
      <div class="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span class="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
    <!-- TradingView Widget END -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      opacity: "0",
    };
  },
  mounted() {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "FOREXCOM:NSXUSD", title: "US 100" },
        { proName: "FX_IDC:EURUSD", title: "EUR/USD" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: false,
      displayMode: "adaptive",
      locale: "en",
    });

    this.$el.querySelector(".tradingview-widget-container__widget").appendChild(script);

    this.opacity = `1`;
  },
};
</script>

<style lang="scss" scoped>
.tradingview-widget-container {
  position: relative;
  height: #{scaleValue(40)};
  width: 100vw;
  overflow: hidden;
  background: $traderview-background;

  @media only screen and (max-width: 414px) {
    display: none;
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    background: $traderview-background;
    width: #{scaleValue(30)};
    height: 90%;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
}
</style>
