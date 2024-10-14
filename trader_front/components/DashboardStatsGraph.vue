<template>
  <div class="statsgraph">
    <div ref="statsgraph" class="statsgraph__graph"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.render();
  },
  methods: {
    render() {
      const statsgraph = this.$refs.statsgraph;
      statsgraph.innerHTML = "";
      const statsgraphWidth = statsgraph.getBoundingClientRect().width;
      const statsgraphHeight = statsgraph.getBoundingClientRect().height;

      const chart = LightweightCharts.createChart(statsgraph, {
        width: statsgraphWidth,
        height: statsgraphHeight,
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
          fontSize: 15,
          fontWeight: 700,
          horzAlign: "center",
          vertAlign: "center",
          color: "rgba(0, 255, 255, .2)",
          text: `Tradex Quant`,
        },
        layout: {
          background: {
            type: "solid",
            color: "rgba(30, 30, 30, 0)",
          },
          textColor: "rgba(255, 255, 255, 0.3)",
        },
        grid: {
          horzLines: {
            color: "rgba(30, 30, 30, 0)",
          },
          vertLines: {
            color: "rgba(30, 30, 30, 0)",
          },
        },
      });

      const areaSeries = chart.addAreaSeries({
        topColor: "rgba(32, 77, 176, .5)",
        bottomColor: "rgba(32, 77, 176, .05)",
        lineColor: "rgba(32, 77, 176, 1)",
        lineWidth: 1,
        symbol: "",
      });

      areaSeries.setData([
        { time: "2024-01-08 00:00", value: 154 },
        { time: "2024-01-08 01:00", value: 154.2 },
        { time: "2024-01-08 02:00", value: 155.60001 },
        { time: "2024-01-08 03:00", value: 156.25 },
        { time: "2024-01-08 04:00", value: 156.25 },
        { time: "2024-01-08 05:00", value: 156.05 },
        { time: "2024-01-08 06:00", value: 158.05  },
        { time: "2024-01-08 07:00", value: 157.3 },
        { time: "2024-01-08 08:00", value: 144 },
        { time: "2024-01-08 09:00", value: 144.8 },
        { time: "2024-01-08 10:00", value: 143.5 },
        { time: "2024-01-08 11:00", value: 147.05 },
        { time: "2024-01-08 12:00", value: 144.85001 },
        { time: "2024-01-08 13:00", value: 145.39999 },
        { time: "2024-01-08 14:00", value: 147.3 },
        { time: "2024-01-08 15:00", value: 153.55 },
        { time: "2024-01-08 16:00", value: 150.95 },
        { time: "2024-01-08 17:00", value: 149.39999 },
        { time: "2024-01-08 18:00", value: 148.5 },
        { time: "2024-01-08 19:00", value: 146.60001 },
        { time: "2024-01-08 20:00", value: 145.60001 },
        { time: "2024-01-08 21:00", value: 144.3 },
        { time: "2024-01-08 22:00", value: 144 },
        { time: "2024-01-08 23:00", value: 147.3 },
      ]);

      chart.timeScale().fitContent();

      chart.timeScale().applyOptions({
        borderColor: "rgba(30, 30, 30, 0)",
      });

      // Styling the price scale (right line)
      chart.priceScale("right").applyOptions({
        borderColor: "rgba(30, 30, 30, 0)",
      });

      window.addEventListener("resize", () => {
        const updatedWidth = statsgraph.getBoundingClientRect().width;
        chart.applyOptions({ width: updatedWidth });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.statsgraph {
  margin-top: #{scaleValue(20)};

  &__graph {
    height: #{scaleValue(230)};
    width: #{scaleValue(500)};
    display: flex;
    align-items: center;
  }
}
</style>
