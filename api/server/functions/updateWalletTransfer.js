import Wallet from '../models/wallet';
import WalletAsset from '../models/walletAsset';

import arithmetic from '../utils/arithmetic';

const { subtractAndConvertToNumber, addAndConvertToNumber } = arithmetic;

async function updateWalletTransfer(newassetbalance, { deductfrom_asset }) {
    return new Promise( async (resolve, reject) => {
        try {
            const ownerId = newassetbalance.ownerId;
            const walletType = newassetbalance.transactionType.toWallet;
            const fee = newassetbalance.transactionType.fee;
            const assetdb_id = newassetbalance.assetId;
            const balanceAmount = newassetbalance.balanceAmount;
            const assetType = newassetbalance.assetType;
            const transactionType = newassetbalance.transactionType.type;

            const user_wallet = await Wallet.findOne({ ownerId, walletType });
            const walletId = user_wallet._id;

            const { balanceinWallet } = deductfrom_asset;
            const updatedbalanceinWalletFrom = subtractAndConvertToNumber(balanceinWallet, addAndConvertToNumber(balanceAmount, fee));

            const deductfrom_asset_balanceHistory = {
                balance: updatedbalanceinWalletFrom,
                transactionType
            }

            WalletAsset.findOneAndUpdate(
                { _id: deductfrom_asset._id }, 
                { 
                    balanceinWallet: updatedbalanceinWalletFrom,
                    balanceHistory: [...deductfrom_asset.balanceHistory, deductfrom_asset_balanceHistory]
                }, 
                { new: true }, async (err, updatedWalletAsset) => {
                    if (err) {
                        console.log(err)
                    } else {
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

                            resolve({ message: 'transfer complete', updatedWalletAsset, walletasset: new_walletasset });
                        }

                        if (wallet_asset) {
                            const balanceinWallet = wallet_asset.balanceinWallet + balanceAmount;
                            const balanceHistory = {
                                balance: balanceAmount,
                                transactionType
                            }
            
                            wallet_asset.balanceinWallet = balanceinWallet;
                            wallet_asset.balanceHistory.push(balanceHistory);
                            await wallet_asset.save();

                            resolve({ 
                                message: 'transfer complete', 
                                updatedWalletAsset, 
                                walletasset: wallet_asset 
                            });
                        }
                    }
                });

        } catch (error) {
            reject(error);
        }
    });
}

export default updateWalletTransfer;