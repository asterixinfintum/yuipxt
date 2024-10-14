<template>
    <div class="traderview">
        <div id="tradingview_08df5"></div>
    </div>
</template>

<script>
export default {
    props: ['currentpair'],
    methods: {
        renderchart() {
            if (this.currentpair) {
                if (this.currentpair.assettype === 'crypto') {
                    new TradingView.widget(
                        {
                            "autosize": true,
                            "symbol": `BINANCE:${this.currentpair.symbol}`.replace('/', ''),
                            "interval": "D",
                            "timezone": "Etc/UTC",
                            "theme": "dark",
                            "style": "1",
                            "locale": "en",
                            "enable_publishing": false,
                            "allow_symbol_change": true,
                            "container_id": "tradingview_08df5",
                        }
                    );
                }

                if (this.currentpair.assettype === 'stock') {
                    new TradingView.widget(
                        {
                            "autosize": true,
                            "symbol": `NYSE:${this.currentpair.symbol}`,
                            "interval": "D",
                            "timezone": "Etc/UTC",
                            "theme": "dark",
                            "style": "1",
                            "locale": "en",
                            "enable_publishing": false,
                            "allow_symbol_change": true,
                            "container_id": "tradingview_08df5"
                        }
                    );
                }

                if (this.currentpair.assettype === 'commodity') {
                    new TradingView.widget(
                        {
                            "autosize": true,
                            "symbol": `${this.currentpair.graphvalue}`,
                            "interval": "D",
                            "timezone": "Etc/UTC",
                            "theme": "dark",
                            "style": "1",
                            "locale": "en",
                            "enable_publishing": false,
                            "allow_symbol_change": true,
                            "container_id": "tradingview_08df5"
                        }
                    );
                }
            }
        }
    },
    mounted() {
        /*const container = document.getElementById('tradingview_08df5');

        var chart = LightweightCharts.createChart(container, {
            width: document.getElementById('tradingview_08df5').clientWidth,
            height: document.getElementById('tradingview_08df5').clientHeight,
            layout: {
                background: {
                    type: 'solid',
                    color: '#000000',
                },
                textColor: 'rgba(33, 56, 77, 1)',
            }
        });

        var barSeries = chart.addBarSeries({
            thinBars: true,
            downColor: '#e9485a',
            upColor: '#31c48a',
        });

        let data = [...this.dt];

        const graphdata = data.map(dataitem => {
            let data = {}

            data.time = dataitem.time;
            data.open = parseInt(dataitem.open);
            data.high = parseInt(dataitem.high);
            data.low = parseInt(dataitem.low);
            data.close = parseInt(dataitem.close);

            console.log(dataitem.time);
            console.log(data.time);

            return data;
        });

        console.log(graphdata[0].time);
        console.log(graphdata);

        barSeries.setData(graphdata);
        chart.timeScale().fitContent();*/

        this.renderchart();

    },
    watch: {
        currentpair(newval, oldval) {
            this.renderchart();
        }
    }
}
</script>
 
<style lang="scss" scoped>
.traderview {
    height: 45vh;
}

#tradingview_08df5 {
    height: 45vh
}
</style>