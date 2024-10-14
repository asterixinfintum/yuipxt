import Wallet from '../models/wallet';
import WalletAsset from '../models/walletAsset';

async function updateWalletDeposit(newassetbalance) {
    return new Promise( async (resolve, reject) => {
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
                const walletasset = {
                    ownerId,
                    walletId,
                    assetdb_id,
                    assetType,
                    balanceinWallet: balanceAmount,
                    balanceHistory: [
                        {
                            balance: balanceAmount,
                            transactionType
                        }
                    ]
                }

                const new_walletasset = new WalletAsset(walletasset);
                await new_walletasset.save();

                resolve(new_walletasset)
            } 
            
            if (wallet_asset) {
                //console.log(wallet_asset, 'debug here');
                const balanceinWallet = wallet_asset.balanceinWallet + balanceAmount;
                const balanceHistory = {
                    balance: balanceAmount,
                    transactionType
                }

                wallet_asset.balanceinWallet = balanceinWallet;
                wallet_asset.balanceHistory.push(balanceHistory);
                await wallet_asset.save();

                resolve(wallet_asset);
            }
            
        } catch (error) {
            reject(error);
        }
    })
}

export default updateWalletDeposit;