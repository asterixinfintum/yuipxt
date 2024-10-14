export default {
    data() {
        return {
            buyquantitypercentage: 0,
            sellquantitypercentage: 0,
            buyquantity: 0,
            totalbuycost: 0,
            totalbuycostusd: 0,
            buyprice: 0,
            sellquantity: 0,
            totalsellcost: 0,
            totalsellcostusd: 0,
            sellprice: 0,
            stopsell: '',
            stopbuy: ''
        }
    },
    mounted() {
        this.buyprice = this.assetequivalence;
        this.sellprice = this.assetequivalence;
    },
    methods: {
        reset() {
            this.buyquantitypercentage = 0;
            this.sellquantitypercentage = 0;
            this.buyquantity = 0;
            this.totalbuycost = 0;
            this.totalbuycostusd = 0;
            this.sellquantity = 0;
            this.totalsellcost = 0;
            this.totalsellcostusd = 0;
            this.buyprice = this.assetequivalence;
            this.sellprice = this.assetequivalence;
        }
    },
    watch: {
        autoTrade() {
            this.reset();
        },
        orderType() {
            this.reset();
        },
        assetequivalence(newval, oldval) {
            this.buyprice = newval
            this.sellprice = newval
        },
        buyquantitypercentage(newval, oldval) {
            const { assetOnRightSideOfOrderPair, asset, assetblc, orderType, autoTrade } = this;

            const assetbalance = assetblc(assetOnRightSideOfOrderPair).blc;

            const assetbalanceUSD = assetblc(assetOnRightSideOfOrderPair).usdblc;
            const priceofasset = asset.price;

            const total = (newval / 100) * assetbalance;
            //const totalusd = (newval / 100) * assetbalanceUSD;

            if (autoTrade === 'true') {
                this.buyquantity = total / this.buyprice;
                return this.totalbuycost = total;
            }

            if (orderType === 'market') {
                this.totalbuycost = total;
                this.buyquantity = total / this.buyprice;
                //this.totalbuycostusd = totalusd
            } else {
                this.buyquantity = total / this.buyprice;
                this.totalbuycost = this.buyprice * this.buyquantity
            }
        },
        sellquantitypercentage(newval, oldval) {
            const { assetOnRightSideOfOrderPair, asset, assetblc, orderType, autoTrade } = this;

            if (orderType === 'market') {
                const assetbalance = assetblc(asset).blc;
                const total = (newval / 100) * assetbalance
                this.sellquantity = parseFloat(`${this.sellprice}`.replace(/,/g, '')) * ((total * parseFloat(`${this.sellprice}`.replace(/,/g, ''))) / parseFloat(`${asset.price}`.replace(/,/g, '')));

                this.totalsellcost = total;
            } else {
                const assetbalance = assetblc(asset).blc;
                const total = (newval / 100) * assetbalance
                this.sellquantity = (total * parseFloat(`${this.sellprice}`.replace(/,/g, ''))) / parseFloat(`${asset.price}`.replace(/,/g, ''));
                const totalsellcost = parseFloat(`${this.sellprice}`.replace(/,/g, '')).toFixed(10) * this.sellquantity.toFixed(10);

                this.totalsellcost = totalsellcost.toFixed(10);
            }
        }
    },
    computed: {
        allowbuy() {
            const { orderType, autoTrade } = this;

            if (autoTrade === 'true') {
                if (this.totalbuycost && this.totalbuycost > 0) {
                    return true;
                } else {
                    return false
                }
            }

            if (orderType === 'market') {
                if (this.totalbuycost && this.totalbuycost > 0) {
                    return true;
                } else {
                    return false
                }
            }

            if (orderType === 'limit' || orderType === 'stop limit') {
                if (this.totalbuycost && this.totalbuycost > 0 && this.buyquantity && this.buyquantity > 0) {
                    return true;
                } else {
                    return false
                }
            }

            return null;
        },
        allowsell() {
            const { orderType } = this;

            if (orderType === 'market') {
                if (this.totalsellcost && this.totalsellcost > 0) {
                    return true;
                } else {
                    return false
                }
            }

            if (orderType === 'limit' || orderType === 'stop limit') {
                if (this.totalsellcost && this.totalsellcost > 0 && this.sellquantity && this.sellquantity > 0) {
                    return true;
                } else {
                    return false
                }
            }

            return null;
        },
        totalbuyquantity() {
            const { asset, assetblc, buyquantity } = this;

            const assetbalance = assetblc(asset).blc;

            const totalbuyquantity = (buyquantity / 100) * assetbalance;

            return totalbuyquantity;
        },
        assetequivalence() {
            const { asset, assetOnRightSideOfOrderPair } = this;

            const assetoneprice = parseFloat(`${asset.price}`.replace(/,/g, ''));
            const assettwoprice = parseFloat(`${assetOnRightSideOfOrderPair.price}`.replace(/,/g, ''));

            return (assetoneprice / assettwoprice)
        }
    }
}