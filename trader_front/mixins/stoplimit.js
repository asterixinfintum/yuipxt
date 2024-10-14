import { mapActions, mapState } from "vuex";
import createorderMixin from "@/mixins/createorder";

export default {
    mixins: [createorderMixin],
    methods: {
        ...mapActions("order", ["getorders", "getautotrades", "gettrades"]),
        async createstoporder({ side, total, price, stopprice, quantity, assettobuy, assettosell, assettobuytype, assettoselltype, fees }) {
            const { orderdetails, currentpair, orderType, wallettype, wallets } = this;

            const tradingPair = currentpair.pair;
            const type = orderType;
            const wallet = wallets.find(wallet => wallet.walletType === wallettype);

            if (!stopprice) {
                return alert('specify a stop price');
            }

            const order = {
                tradingPair,
                pairId: currentpair._id,
                type: 'stop',
                side,
                total,
                limitprice: price,
                stopprice,
                quantity,
                assettobuy,
                assettosell,
                assettobuytype,
                assettoselltype,
                wallettype,
                wallet: wallet._id,
                fees
            }

            if (!orderdetails) {
                this.orderdetails = {
                    tradingPair,
                    type,
                    'Fees': `$${fees.toFixed(10)}`,
                    side,
                    'Limit Price': `${parseFloat(`${price}`.replace(/,/g, '')).toFixed(10)} ${tradingPair}`,
                    'Stop price': `${parseFloat(`${stopprice}`.replace(/,/g, '')).toFixed(10)} ${tradingPair}`,
                    Sell: `${total} ${side === 'sell' ? this.asset.coin : this.assetOnRightSideOfOrderPair.coin}`,
                    Buy: `${quantity.toFixed(10)} ${side === 'buy' ? this.asset.coin : this.assetOnRightSideOfOrderPair.coin}`
                }
            }

            if (orderdetails) {
                this.loading = true;
                try {
                    const response = await this.createStpLmtOrder(order);

                    if (response.message) {
                        this.successMessage = 'Market stop limit order executed successfully';
                        this.orderdetails = null;
                    } else {
                        // Handle the case where the operation may be successful but doesn't have a 'message'
                        // Maybe set some other flags or log for debugging
                    }
                } catch (error) {
                    console.log(error)
                } finally {
                    this.loading = false;
                    this.getorders();
                    this.reset();
                }

            }
        },
        createstopbuyorder() {
            const fees = (this.tradepercentage / 100) * this.totalbuycost;

            this.createstoporder({
                side: 'buy',
                total: this.totalbuycost,
                price: this.buyprice,
                stopprice: this.stopbuy,
                quantity: this.buyquantity,
                assettobuy: this.asset._id,
                assettosell: this.assetOnRightSideOfOrderPair._id,
                assettobuytype: this.asset.assetType,
                assettoselltype: this.assetOnRightSideOfOrderPair.assetType,
                fees
            });
        },
        createstopsellorder() {
            const fees = (this.tradepercentage / 100) * this.totalsellcost;

            this.createstoporder({
                side: 'sell',
                total: this.totalsellcost,
                price: this.sellprice,
                stopprice: this.stopsell,
                quantity: this.sellquantity,
                assettosell: this.asset._id,
                assettobuy: this.assetOnRightSideOfOrderPair._id,
                assettoselltype: this.asset.assetType,
                assettobuytype: this.assetOnRightSideOfOrderPair.assetType,
                fees
            });
        }
    }
}