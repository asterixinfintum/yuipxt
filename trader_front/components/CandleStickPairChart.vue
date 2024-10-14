<template>
  <div class="pairgraph">
    <div v-if="loading" class="loader__body">
      <div class="loader"></div>
    </div>
    <div class="pairgraph__graph" ref="pairgraph"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
    };
  },
  props: ["currentpair", "candlestickcurrentpairhourgraph"],
  watch: {
    candlestickcurrentpairhourgraph(newval, oldval) {
      this.renderchart();
      /*if (newval.length && newval.length > 0) {
        this.loading = false;
        this.renderchart();
      } else {
        const pairgraph = this.$refs.pairgraph;
        pairgraph.innerHTML = "";

        this.loading = true;
      }*/
    },
  },
  methods: {
    renderchart() {
      const pairgraph = this.$refs.pairgraph;

      pairgraph.innerHTML = "";
      const pairgraphWidth = pairgraph.getBoundingClientRect().width;

      const chart = LightweightCharts.createChart(pairgraph, {
        width: pairgraphWidth,
        height: 500,
        autoSize: true,
        rightPriceScale: {
          borderColor: "rgba(197, 203, 206, 0.8)",
        },
        timeScale: {
          borderColor: "rgba(197, 203, 206, 0.8)",
          barSpacing: 20,
          minBarSpacing: 5,
          secondsVisible: true,
          fixLeftEdge: true,
          fixRightEdge: true,
          timeVisible: true, // This should be set to true to show time
          secondsVisible: false, // Typically false for hourly data
        },
        watermark: {
          visible: true,
          fontSize: 24,
          fontWeight: 700,
          horzAlign: "center",
          vertAlign: "center",
          color: "rgba(0, 255, 255, .2)",
          text: `(${this.currentpair.pair}) BVX Finance`,
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
            color: "rgba(0, 255, 255, .08)",
          },
          vertLines: {
            color: "rgba(0, 255, 255, .08)",
          },
        },
      });

      var candleSeries = chart.addCandlestickSeries({
        upColor: "rgb(14, 203, 129)",
        downColor: "#FF3F34",
        borderDownColor: "#FF3F34",
        borderUpColor: "#39FF14",
        wickDownColor: "rgba(255, 144, 0, 1)",
        wickUpColor: "rgba(255, 144, 0, 1)",
      });

      const cdata = this.candlestickcurrentpairhourgraph.map((d) => {
        return {
          time: d.time,
          open: parseFloat(d.open),
          high: parseFloat(d.high),
          low: parseFloat(d.low),
          close: parseFloat(d.close),
        };
      });

      candleSeries.setData(cdata);

      const priceScale = candleSeries.priceScale();
      priceScale.applyOptions({
        autoScale: true, // This will automatically adjust the scale
      });

      /*chart.applyOptions({
        priceScale: {
          priceFormat: {
            type: "custom",
            formatter: (price) => price.toFixed(2),
          },
        },
        layout: {
          //barSpacing: 5, // Adjust this value to make candles thinner
        },
      });

      //chart.timeScale().fitContent();

      /*chart.timeScale().setVisibleRange({
        from: this.candlestickcurrentpairhourgraph[0].time,
        to: this.candlestickcurrentpairhourgraph[
          this.candlestickcurrentpairhourgraph.length - 1
        ].time,
      });*/

      const timeScale = chart.timeScale();

      timeScale.fitContent();

      window.addEventListener("resize", () => {
        const updatedWidth = pairgraph.getBoundingClientRect().width;
        chart.applyOptions({ width: updatedWidth });
      });
    },
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

  &__body {
    transform: translateY(#{scaleValue(50)});
  }
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
