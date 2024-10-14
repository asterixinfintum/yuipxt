import ExecutedTrade from '../executedtrade';
import Wallet from '../../../wallet/models/wllt';

import getswapquants from './getswapquants';

async function executesell(executionPrice) {
    return new Promise(async (resolve, reject) => {
        try {
            const side = this.side;
            const userId = this.userId;
            const tradingPair = this.tradingPair;
            const assetId = this.assetId;
            const oppstasstId = this.oppstasstId;
            const assetType = this.assetType;
            const quantity = this.quantity;

            const _id = this.wallet;
            const wllt = await Wallet.findOne({ _id });

            const quantswaps = await getswapquants({
                assetOne: oppstasstId,
                assetTwo: assetId,
                quantAssetTwo: quantity
            });

            const { asstOne, asstTwo } = quantswaps;

            console.log(asstOne, asstTwo)

            await wllt.withdraw(asstTwo.quantity, asstTwo.id)
                .then(() => {
                    wllt.deposit(asstOne.quantity, asstOne.id)
                        .then(async () => {
                            if (this.filled < this.quantity &&
                                quantity <= (this.quantity - this.filled) &&
                                this.status !== 'canceled' &&
                                this.status !== 'executed'
                            ) {
                                let status;
                                const filled = quantity + this.filled;
                                const orderAmount = (quantity * executionPrice);

                                if (filled !== this.quantity) {
                                    status = 'partially filled'
                                } else {
                                    status = 'executed'
                                }

                                const executedtrade = new ExecutedTrade({
                                    userId,
                                    tradingPair,
                                    assetId,
                                    assetType,
                                    side,
                                    executionPrice,
                                    quantity,
                                    orderAmount
                                });

                                this.filled = filled;
                                this.status = status;
                                this.ltstExecPrice = executionPrice;

                                await executedtrade.save();
                                await this.save();
                                resolve(this);
                            } else {
                                this.status = 'canceled';
                                this.save();
                                reject('order could not be executed, insufficient funds');
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    reject(err)
                })

        } catch (error) {
            console.log(error);
        }
    });
}

export default executesell;