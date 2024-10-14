import express from 'express';

import authenticateToken from '../../utils/authenticateToken';

import UserWallet from '../../userwallet/models/wallet';
import Asset from '../../models/asset';

const swapcontroller = express.Router();

function parseNumber(str) {
    const stringWithoutCommas = str.replace(/,/g, '');

    const numericValue = parseFloat(stringWithoutCommas);

    return numericValue;
}

function getStringFromObjectId(objectId) {
    return objectId.toString();
}

swapcontroller.put('/swap/userwallet/asset', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const swapinfo = req.body;

            const assetfrom = await Asset.findOne({ _id: swapinfo.assetfromid });
            const assetto = await Asset.findOne({ _id: swapinfo.assettoid });
            const userwallet = await UserWallet.findOne({ _id: swapinfo.walletid });

            if (assetfrom && assetto) {
                const assetfromid = getStringFromObjectId(assetfrom._id);
                const assettoid = getStringFromObjectId(assetto._id);

                let balances = userwallet.balances.filter(blc => blc && blc !== null && blc.asset_id);
                const balancefrom = balances.find(blc => blc.asset_id === assetfromid);

                if (balancefrom) {
                    balancefrom.balance = balancefrom.balance - swapinfo.totaltodeductfromassetfrom;

                    const balanceto = balances.find(blc => blc.asset_id === assettoid);
                    let balancefromupdate = {};
                    let balancetoupdate = {};

                    balancefromupdate = balancefrom;

                    if (balanceto) {
                        //console.log(balanceto);
                        balanceto.balance = balanceto.balance + parseFloat(swapinfo.amounttoaddtoassetto);
                        balancetoupdate = balanceto;
                    } else {
                        balancetoupdate = {
                            asset_id: assettoid,
                            balance: parseFloat(swapinfo.amounttoaddtoassetto),
                            assetname: assetto.name
                        }
                    }

                    balances = [
                        ...balances.filter(blc => blc.asset_id !== assetfromid && blc.asset_id !== assettoid),
                        balancefromupdate,
                        balancetoupdate
                    ];

                    const update = {
                        $set: {
                            balances
                        }
                    };

                    const options = { new: true, upsert: true };

                    UserWallet.findOneAndUpdate({ _id: userwallet._id }, update, options)
                        .then(updatedWallet => {
                            if (updatedWallet) {
                                res.status(201).send({ message: 'swap executed', updatedWallet });
                            } else {
                                console.log('No wallet matches the provided query.');
                                res.status(500).send({ error: 'error swaping assets' });
                            }
                        })
                        .catch(err => console.error(`Failed to find and update wallet: ${err}`));
                } else {
                    res.status(404).send({ message: 'one of the assets does not exist in balance' });
                }
            } else {
                res.status(404).send({ message: 'one of the assets does not exist' });
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'error swaping assets' });
        }
    }
});

swapcontroller.get('/swap/getfeededuction', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { assetfromid, swapfee } = req.query;

            const swapfeenum = parseNumber(swapfee)

            const fromAsset = await Asset.findOne({ _id: assetfromid });

            const feededuction = swapfeenum / fromAsset.price;

            res.status(200).send({ feededuction })
        } catch (error) {
            res.status(500).send({ error: 'error getting fee deduction' });
        }
    }
});

swapcontroller.get('/swap/getrates', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { assetfromid, assettoid, inputvalue, swapfee } = req.query;

            const inputvaluenum = parseNumber(inputvalue);
            const swapfeenum = parseNumber(swapfee);

            const fromAsset = await Asset.findOne({ _id: assetfromid });
            const toAsset = await Asset.findOne({ _id: assettoid });

            const fromAsset_quantity = inputvaluenum * fromAsset.price;
            const toAsset_quantity = fromAsset_quantity / toAsset.price;
            const expectedamountUSD = toAsset_quantity * toAsset.price;

            const assetfrom_to_assetto = fromAsset.price / toAsset.price;

            const feededuction = swapfeenum / fromAsset.price;

            if (fromAsset_quantity <= 5) {
                res.status(200).send({
                    message: 'no rate available',
                    fromAssetprice: fromAsset.price,
                    toAssetprice: toAsset.price,
                    fromAsset_quantity,
                    assetfrom_to_assetto,
                    feededuction,
                    total: feededuction + inputvaluenum
                });
            } else {
                res.status(200).send({
                    message: 'rate available',
                    expectedamount: toAsset_quantity,
                    fromAssetprice: fromAsset.price,
                    toAssetprice: toAsset.price,
                    fromAsset_quantity,
                    expectedamountUSD,
                    assetfrom_to_assetto,
                    feededuction,
                    total: feededuction + inputvaluenum
                });
            }
        } catch (error) {
            res.status(500).send({ error: 'error swaping assets' });
        }
    }
});

swapcontroller.get('/swap/getassets', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { walletid, assetype } = req.query;

            const userwallet = await UserWallet.findOne({ _id: walletid });

            const details = await userwallet.returnBalance({ assetType: assetype });

            const { walletassets_list } = details;

            res.status(200).send({ walletassets_list });
        } catch (error) {
            res.status(500).send({ error: 'error swaping assets' });
        }
    }
});

export default swapcontroller;