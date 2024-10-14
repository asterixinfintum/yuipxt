import Wallet from '../models/wallet';
import WalletAsset from '../models/walletAsset';

async function updateWalletWithdrawal(newassetbalance) {
    return new Promise(async (resolve, reject) => {
        try {
            const ownerId = newassetbalance.ownerId;
            const walletType = newassetbalance.transactionType.toWallet;
            const assetdb_id = newassetbalance.assetId;
            const balanceAmount = newassetbalance.balanceAmount;
            const assetType = newassetbalance.assetType;
            const transactionType = newassetbalance.transactionType.type;

            const user_wallet = await Wallet.findOne({ ownerId, walletType });
            const walletId = user_wallet._id;
            const wallet_asset = await WalletAsset.findOne({ ownerId, assetdb_id, walletId });

            if (!wallet_asset) {
                console.log('hey there')
                reject('no wallet asset of the kind');
            }

            if (wallet_asset && wallet_asset.assetType === assetType) {
                if (wallet_asset.balanceinWallet <= balanceAmount) {
                    reject('insufficient funds');
                }

                if (wallet_asset.balanceinWallet > balanceAmount) {
                    const balanceinWallet = wallet_asset.balanceinWallet - balanceAmount;
                    const balanceHistory = {
                        balance: balanceAmount,
                        transactionType
                    }

                    wallet_asset.balanceinWallet = balanceinWallet;
                    wallet_asset.balanceHistory.push(balanceHistory);

                    await wallet_asset.save();
                    resolve(wallet_asset);
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

export default updateWalletWithdrawal;