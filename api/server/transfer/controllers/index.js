import express from 'express';

import authenticateToken from '../../utils/authenticateToken';

import UserWallet from '../../userwallet/models/wallet';
import Asset from '../../models/asset';

const transfercontroller = express.Router();

transfercontroller.put('/transfer/userwallet/asset', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const transferinfo = req.body;

            const walletfrom = await UserWallet.findOne({ _id: transferinfo.walletfromid });
            const walletto = await UserWallet.findOne({ _id: transferinfo.wallettoid });
            const asset = await Asset.findOne({ _id: transferinfo.assetfromid })

            if (walletfrom && walletto) {
                let balancesfrom = walletfrom.balances.filter(blc => blc !== null);
                let balancesto = walletto.balances.filter(blc => blc !== null);

                const balancefrom = balancesfrom.find(blc => blc.asset_id === transferinfo.assetfromid);
                let balanceto = balancesto.find(blc => blc.asset_id === transferinfo.assetfromid);

                balancefrom.balance = balancefrom.balance - parseFloat(transferinfo.totaltodeductfromassetfrom);

                if (asset) {
                    if (balanceto) {
                        balanceto.balance = balanceto.balance + parseFloat(transferinfo.totaltodeductfromassetfrom);
                    } else {
                        balanceto = {
                            asset_id: transferinfo.assetfromid,
                            balance: parseFloat(transferinfo.totaltodeductfromassetfrom),
                            assetname: asset.name
                        }
                    }

                    balancesfrom = [
                        ...walletfrom.balances.filter(blc => blc !== null && blc.asset_id !== transferinfo.assetfromid),
                        balancefrom
                    ];

                    balancesto = [
                        ...walletto.balances.filter(blc => blc !== null && blc.asset_id !== transferinfo.assetfromid),
                        balanceto
                    ];

                    const updatefrom = {
                        $set: {
                            balances: balancesfrom
                        }
                    };

                    const updateto = {
                        $set: {
                            balances: balancesto
                        }
                    };

                    const options = { new: true, upsert: true };

                    await UserWallet.findOneAndUpdate({ _id: transferinfo.walletfromid }, updatefrom, options);

                    await UserWallet.findOneAndUpdate({ _id: transferinfo.wallettoid }, updateto, options);


                } else {
                    res.status(404).send({ error: 'asset not found' });
                }


                res.status(200).send({ message: 'transfer executed' });
            } else {
                res.status(404).send({ error: 'wallet not found' });
            }
        } catch (error) {
            res.status(500).send({ error: 'error executing transfer' });
        }
    }
})

export default transfercontroller;