import Wallet from '../../../wallet/models/wllt';
import Asset from '../../../models/asset';

async function executeorder({ percentage }) {
    try {
        const currentWallet = await Wallet.findOne({
            walletType: this.wallettype,
            _id: this.wallet
        });

        const assetToSell = await Asset.findOne({ _id: this.assettosell });
        const assetToBuy = await Asset.findOne({ _id: this.assettobuy });

        if (!currentWallet || !assetToSell) {
            throw new Error('Wallet or Asset not found');
        }

        let assetBuyUnitsToFill;
        let assetBuyUnitsInUSD;
        let assetSellUnitsToFill;
        let filled
        let assetSellUnitsInUSD;

        const fillPercent = percentage / 100;

        if (this.side === 'buy') {
            assetBuyUnitsToFill = fillPercent * this.quantity;
            assetBuyUnitsInUSD = assetBuyUnitsToFill * this.price;
            assetSellUnitsToFill = assetBuyUnitsInUSD / assetToSell.price;
            filled = ((assetBuyUnitsToFill + this.filled) / this.quantity) * 100;
        }

        if (this.side === 'sell') {
            assetSellUnitsToFill = fillPercent * this.total;
            assetSellUnitsInUSD = assetSellUnitsToFill * this.price;
            assetBuyUnitsInUSD = fillPercent * (this.quantity / assetToBuy.price)
            assetBuyUnitsToFill = assetBuyUnitsInUSD * assetToBuy.price;
            filled = ((assetSellUnitsToFill + this.filled) / this.total) * 100;
        }

        const fillingDetails = {
            time: Date.now(),
            fillPercent,
            usdvalue: assetBuyUnitsInUSD,
            assetbuyunits: assetBuyUnitsToFill,
            assetsellunits: assetSellUnitsToFill,
            currentpriceofboughtasset: assetToBuy.price,
            currentpriceofsoldasset: assetToSell.price,
            totalfilled: filled
        };

        this.filled = filled;

        const partialorderfilling = [fillingDetails, ...this.partialorderfilling];

        this.partialorderfilling = partialorderfilling;

        currentWallet.deposit(assetBuyUnitsToFill, this.assettobuy)
        currentWallet.withdraw(assetSellUnitsToFill, this.assettosell)

        this.save();

        return this;
    } catch (error) {
        console.error('Error in executeBuy function:', error);
        // Optionally, rethrow the error or handle it accordingly
        throw error;
    }
}


export default executeorder;