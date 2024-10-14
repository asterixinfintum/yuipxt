import { mapActions, mapState } from "vuex";
import createorderMixin from "@/mixins/createorder";

export default {
    mixins: [createorderMixin],
    methods: {
        ...mapActions("order", ["getorders", "getautotrades", "gettrades"]),
        async createautotradeorder() {
            const { orderdetails, currentpair, orderType, wallettype, wallets } = this;

            const tradingPair = currentpair.pair;
            const wallet = wallets.find(wallet => wallet.walletType === wallettype);

            const fees = (this.tradepercentage / 100) * this.totalbuycost;

            const autotrade = {
                tradingPair,
                total: this.totalbuycost,
                price: this.buyprice,
                assettobuy: this.asset._id,
                assettosell: this.assetOnRightSideOfOrderPair._id,
                assettobuytype: this.asset.assetType,
                assettoselltype: this.assetOnRightSideOfOrderPair.assetType,
                wallettype,
                wallet: wallet._id,
                fees,
                quantity: this.buyquantity
            }

            this.orderdetails = {
                tradingPair,
                fees: `$${fees}`,
                total: `$${this.totalbuycost}`,
            }

            if (orderdetails) {
                this.loading = true;
                try {
                    const response = await this.createAutoTrade(autotrade);

                    if (response.message) {
                        this.successMessage = 'Automatic trade created!';
                        this.orderdetails = null;
                    } else {
                        // Handle the case where the operation may be successful but doesn't have a 'message'
                        // Maybe set some other flags or log for debugging
                    }
                } catch (error) {
                    console.log(error)
                } finally {
                    this.loading = false;
                    this.getautotrades();
                    this.reset();
                }
            }
        }
    }
}