<template>
  <div class="pairgraph">
    <div class="pairgraph__graph" ref="pairgraph">
      <div class="loader" v-if="!currentpairhourgraph.length"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["currentpair", "currentpairhourgraph"],
  watch: {
    currentpair(newval, oldval) {
      //this.renderchart();
    },
    currentpairhourgraph(newval, oldval) {
      if (newval.length && newval.length > 0) {
        this.renderchart();
      }
    },
  },
  methods: {
    renderchart() {
      const pairgraph = this.$refs.pairgraph;

      pairgraph.innerHTML = "";
      const pairgraphWidth = pairgraph.getBoundingClientRect().width;

      const chart = LightweightCharts.createChart(pairgraph, {
        width: 879,
        height: 500,
        timeScale: {
          timeVisible: true, // Makes sure the time is shown on the x-axis
          secondsVisible: false, // Not necessary for hourly data
        },
        rightPriceScale: {
          scaleMargins: {
            top: 0.1,
            bottom: 0.2,
          },
        },
        watermark: {
          visible: true,
          fontSize: 24,
          fontWeight: 700,
          horzAlign: "center",
          vertAlign: "center",
          color: "rgba(0, 255, 255, .2)",
          text: `(${this.currentpair.pair}) Tradex Quant`,
        },
        layout: {
          background: {
            type: "solid",
            color: "#0d0e0f",
          },
          textColor: "rgba(0, 255, 255, .4)",
        },
        grid: {
          horzLines: {
            color: "rgba(0, 255, 255, .01)",
          },
          vertLines: {
            color: "rgba(0, 255, 255, .01)",
          },
        },
      });

      const areaSeries = chart.addAreaSeries({
        topColor: "rgba(32, 77, 176, .5)",
        bottomColor: "rgba(32, 77, 176, .05)",
        lineColor: "rgba(32, 77, 176, 1)",
        lineWidth: 2,
        symbol: "",
      });

      areaSeries.setData(this.currentpairhourgraph);

      chart.applyOptions({
        timeScale: {
          fixLeftEdge: true,
          fixRightEdge: true,
          timeVisible: true, // This should be set to true to show time
          secondsVisible: false, // Typically false for hourly data
          tickMarkFormatter: (time, tickMarkType, locale) => {
            // Custom formatter to display date and time
            const date = new Date(time * 1000); // Convert Lightweight Charts time to JavaScript Date
            return date.toLocaleTimeString(locale, {
              hour: "2-digit",
              minute: "2-digit",
            });
          },
        },
      });

      //chart.timeScale().fitContent();

      chart.timeScale().setVisibleRange({
        from: "Date.parse(2023-01-01 00:00)/1000",
        to: "Date.parse(2023-01-01 23:00)/1000",
      });

      chart.timeScale().fitContent();

      window.addEventListener("resize", () => {
        const updatedWidth = pairgraph.getBoundingClientRect().width;
        chart.applyOptions({ width: updatedWidth });
      });
    },
  },
  mounted() {
    //this.renderchart();
  },
};
</script>

<style lang="scss" scoped>
.pairgraph {
  height: #{scaleValue(500)};
  width: #{scaleValue(835)};
  overflow: hidden;
  
  &__graph {
    height: #{scaleValue(500)};
    width: #{scaleValue(835)};
    display: flex;
    align-items: center;
  }
}

.loader {
  border: 5px solid #f3f3f3; /* Light grey */
  border-top: 5px solid #3498db; /* Blue */
  border-radius: 50%;
  width: #{scaleValue(50)};
  height: #{scaleValue(50)};
  animation: spin 2s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
