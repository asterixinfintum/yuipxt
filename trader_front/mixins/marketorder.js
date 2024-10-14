import { mapActions, mapState } from "vuex";
import createorderMixin from "@/mixins/createorder";

export default {
    mixins: [createorderMixin],
    methods: {
        ...mapActions("order", ["getorders", "getautotrades", "gettrades"]),
        async createmarketorder({ side, total, price, quantity, assettobuy, assettosell, assettobuytype, assettoselltype, fees }) {
            const { orderdetails, currentpair, orderType, wallettype, wallets } = this;

            const tradingPair = currentpair.pair;
            const type = orderType;
            const wallet = wallets.find(wallet => wallet.walletType === wallettype);

            const order = {
                pairId: currentpair._id,
                tradingPair,
                type,
                side,
                total,
                price: parseFloat(`${this.assetequivalence}`.replace(/,/g, '')),
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
                    'Trading Pair': tradingPair,
                    type,
                    fees: fees.toFixed(10),
                    side,
                    Sell: `${total.toFixed(10)} ${side === 'sell' ? this.asset.coin : this.assetOnRightSideOfOrderPair.coin}`,
                    Buy: `${quantity.toFixed(10)} ${side === 'buy' ? this.asset.coin : this.assetOnRightSideOfOrderPair.coin}`
                }

                console.log(this.orderdetails);
            }

            if (orderdetails) {
                this.loading = true;
                try {
                    const response = await this.createMktOrder(order);

                    if (response.message) {
                        this.successMessage = 'Market order executed successfully';
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
        createbuymarketorder() {
            const fees = (this.tradepercentage / 100) * this.totalbuycost;

            console.log(this.buyquantity, 'check here yo');

            this.createmarketorder({
                side: 'buy',
                total: this.totalbuycost,
                price: this.asset.price,
                quantity: this.buyquantity,
                assettobuy: this.asset._id,
                assettosell: this.assetOnRightSideOfOrderPair._id,
                assettobuytype: this.asset.assetType,
                assettoselltype: this.assetOnRightSideOfOrderPair.assetType,
                fees
            })
        },
        createsellmarketorder() {
            const fees = (this.tradepercentage / 100) * this.totalsellcost;

            console.log(this.sellquantity, 'check here yo');

            this.createmarketorder({
                side: 'sell',
                total: this.totalsellcost,
                price: this.asset.price,
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