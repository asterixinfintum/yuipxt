import createorderMixin from "@/mixins/createorder";
import { mapActions, mapState } from "vuex";

export default {
    mixins: [createorderMixin],
    methods: {
        ...mapActions("order", ["getorders", "getautotrades", "gettrades"]),
        async createlimitorder({ side, total, price, quantity, assettobuy, assettosell, assettobuytype, assettoselltype, fees }) {
            const { orderdetails, currentpair, orderType, wallettype, wallets } = this;

            const tradingPair = currentpair.pair;
            const type = orderType;
            const wallet = wallets.find(wallet => wallet.walletType === wallettype);

            const order = {
                tradingPair,
                pairId: currentpair._id,
                type,
                side,
                total,
                limitprice: price,
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
                    fees: `$${fees.toFixed(10)}`,
                    side,
                    'Limit price': `${parseFloat(`${price}`.replace(/,/g, '')).toFixed(10)} ${tradingPair}`,
                    Sell: `${total} ${side === 'sell' ? this.asset.coin : this.assetOnRightSideOfOrderPair.coin}`,
                    Buy: `${quantity.toFixed(10)} ${side === 'buy' ? this.asset.coin : this.assetOnRightSideOfOrderPair.coin}`,
                }
            }

            if (orderdetails) {
                this.loading = true;
                try {
                    const response = await this.createLmtOrder(order);

                    if (response.message) {
                        this.successMessage = 'Market limit order executed successfully';
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
        createlimitbuyorder() {
            const fees = (this.tradepercentage / 100) * this.totalbuycost;

            this.createlimitorder({
                side: 'buy',
                total: this.totalbuycost,
                price: this.buyprice,
                quantity: this.buyquantity,
                assettobuy: this.asset._id,
                assettosell: this.assetOnRightSideOfOrderPair._id,
                assettobuytype: this.asset.assetType,
                assettoselltype: this.assetOnRightSideOfOrderPair.assetType,
                fees
            })
        },
        createlimitsellorder() {
            const fees = (this.tradepercentage / 100) * this.totalsellcost;

            this.createlimitorder({
                side: 'sell',
                total: this.totalsellcost,
                price: this.sellprice,
                quantity: this.sellquantity,
                assettosell: this.asset._id,
                assettobuy: this.assetOnRightSideOfOrderPair._id,
                assettoselltype: this.asset.assetType,
                assettobuytype: this.assetOnRightSideOfOrderPair.assetType,
                fees
            })
        }
    }
}