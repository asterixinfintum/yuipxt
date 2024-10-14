export default {
    data() {
        return {
            name: '',
            coin: '',
            symbol: '',
            price: '',
            dailyChange: '',
            supportBorrow: '',
            assetType: '',
            open: '',
            low: '',
            high: '',
            close: '',
            tickerSymbol: '',
            chain: '',
            initialPrice: '',
            marketCap: '',
            liquidity: '',
            totalSupply: '',
            circulatingSupply: '',
            description: '',
            selectedImage: ''
        };
    },
    mounted() {
        const assetId = this.$route.query.assetId;
        this.getAsset(assetId);
    },
    methods: {

    }
}