<template>
    <div>
        <div class="autotrade">
            <div class="content">
                <HeaderBox />

                <div class="content__body">
                    <SideNav />

                    <div class="layout-stretch">
                        <PageIndicator :page_name="'Trade Details'" :transparent="true" :nobtns="true" />

                        <div class="overview__main layout-padding">
                            <div class="">
                                <div id="trade-graph">

                                </div>
                            </div>
                            <div class=""></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createChart, CrosshairMode } from 'lightweight-charts';

export default {
    mounted() {
        const tradeGraph = document.querySelector('#trade-graph');
        const chart = createChart(tradeGraph, {
            width: 600,
            height: 300,
            layout: {
                background: {
                    type: 'solid',
                    color: '#111214',
                },
                textColor: '#ffffff',
            },
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            rightPriceScale: {
                borderColor: 'rgba(197, 203, 206, 1)',
            },
            timeScale: {
                borderColor: 'rgba(197, 203, 206, 1)',
            },
        });
        const barSeries = chart.addCandlestickSeries({
            upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
            wickUpColor: '#26a69a', wickDownColor: '#ef5350',
        });

        const data = [
            { open: 10, high: 10.63, low: 9.49, close: 9.55, time: 1642427876 },
            { open: 9.55, high: 10.30, low: 9.42, close: 9.94, time: 1642514276 },
            { open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: 1642600676 },
            { open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: 1642687076 },
            { open: 9.51, high: 10.46, low: 9.10, close: 10.17, time: 1642773476 },
            { open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: 1642859876 },
            { open: 10.47, high: 11.39, low: 10.40, close: 10.81, time: 1642946276 },
            { open: 10.81, high: 11.60, low: 10.30, close: 10.75, time: 1643032676 },
            { open: 10.75, high: 11.60, low: 10.49, close: 10.93, time: 1643119076 },
            { open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1643205476 },
            { open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1643205476 },
            { open: 10.75, high: 11.60, low: 10.49, close: 10.93, time: 1643119076 },
            { open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1643205476 },
            { open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1693706800 },
        ];

        barSeries.setData(data);

        chart.timeScale().fitContent();
    }
}
</script>