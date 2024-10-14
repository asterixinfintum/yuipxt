<template>
  <div class="tradingview-widget-container" style="height: 100%; width: 100%">
    <div
      class="tradingview-widget-container__widget"
      style="height: calc(100% - 32px); width: 100%"
      ref="graph"
    ></div>
    <div class="tradingview-widget-copyright">
      <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
        <span class="blue-text">Tradex Quant</span>
      </a>
    </div>
  </div>
</template>

<script>
import pairsMixin from "@/mixins/pairs";

export default {
  props: ["currentpair"],
  name: "TradingViewWidget",
  computed: {
    current() {
      const currentsymbol = this.$route.query.baseAsset;

      return currentsymbol;
    },
  },
  mixins: [pairsMixin],
  methods: {
    render() {
      if (this.currentpair) {
        const graph = this.$refs.graph;

        const script = document.createElement("script");
        script.src =
          "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.async = true;
        script.innerHTML = JSON.stringify({
          autosize: true,
          symbol: `${this.currentpair.pairlabel}`,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          allow_symbol_change: true,
          support_host: "https://www.tradingview.com",
        });

        graph.innerHTML = ``;

        graph.appendChild(script);
      }
    },
  },
  watch: {
    currentpair(oldval, newval) {
      //console.log("pair changed here", this.currentpair.pairlabel);
      if (this.currentpair) {
        const graph = this.$refs.graph;

        const script = document.createElement("script");
        script.src =
          "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.async = true;
        script.innerHTML = JSON.stringify({
          autosize: true,
          symbol: `${this.currentpair.pairlabel}`,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          allow_symbol_change: true,
          support_host: "https://www.tradingview.com",
        });

        graph.innerHTML = ``;

        graph.appendChild(script);
      }
    },
  },
  mounted() {
    this.render();
  },
};
</script>

<style scoped>
/* Your CSS styles here */
</style>

<style lang="scss" scoped></style>
