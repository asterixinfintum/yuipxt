import walletMixin from '@/mixins/wallet';

export default {
    data() {
        return {
            asset_price: `25757.95`,
            asset_price_sell: '',
            asset_price_buy: '',
            buy_value: ``,
            buy_value_total: '',
            sliderValue: 0,
            sliderBuyValue: 0,
            sliderSellValue: 0,
        }
    },
    mixins: [walletMixin],
    computed: {
        trackWidth() {
            return (this.sliderValue / 100) * 100;
        },
        buyTrackWidth() {
            return (this.sliderBuyValue / 100) * 100;
        },
        sellTrackWidth() {
            return (this.sliderSellValue / 100) * 100;
        },
        buyThumbPosition() {
            return this.sliderBuyValue;
        },
        sellThumbPosition() {
            return this.sliderSellValue;
        },
        /*reserveCurrency() {
            return 'USDT'
        }*/
    },
    mounted() {
        this.asset_price = this.asset.price;
    }
}