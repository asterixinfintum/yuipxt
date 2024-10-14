import express from 'express';

import authenticateToken from '../../utils/authenticateToken';

const userwalletadmin = express.Router();

import createuserwallet from '../utilities/createuserwallet';

import UserWallet from '../models/wallet';
import Asset from '../../models/asset';
import Withdrawalrequest from '../models/withdrawalrequest';
import Transaction from '../models/transaction';

userwalletadmin.put('/userwallet/updatebalance/', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { walletid, assetid } = req.query;

            const { balance } = req.body;

            if (!walletid || !balance || !assetid) {
                res.status(500).send({ error: 'there must be a balance, assetid, and walletid present' });
                return;
            }

            const userwallet = await UserWallet.findOne({ _id: walletid });

            if (userwallet) {
                const asset = await Asset.findOne({ _id: assetid });

                if (asset) {
                    let balances = userwallet.balances;

                    const assetbalance = balances.find(blc => blc.asset_id === assetid);

                    if (assetbalance) {
                        let assetbalances = balances.filter(blc => blc.asset_id !== assetid);

                        const asset_balance = {
                            asset_id: assetid,
                            balance,
                            assetname: asset.name
                        }

                        assetbalances = [...assetbalances, asset_balance];

                        userwallet.balances = assetbalances;

                        await userwallet.save();

                        res.status(200).send({ userwallet });
                    } else {
                        const asset_balance = {
                            asset_id: assetid,
                            balance,
                            assetname: asset.name
                        }

                        balances = [...balances, asset_balance];

                        userwallet.balances = balances;

                        await userwallet.save();

                        res.status(200).send({ userwallet });
                    }
                } else {
                    res.status(500).send({ error: 'no asset found' });
                }
            } else {
                res.status(500).send({ error: 'no wallet found' });
            }
        } catch (error) {
            res.status(500).send({ error: 'wallet not updated' });
        }
    }
});

userwalletadmin.put('/userwallet/updatebtcaddress/', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { walletid } = req.query;
            const { bitcoinaddress } = req.body;

            if (!walletid || !bitcoinaddress) {
                res.status(500).send({ error: 'there must be a bitcoinaddress and walletid present' });
                return; // Add return to exit the function early
            }

            const userwallet = await UserWallet.findOne({ _id: walletid });

            if (userwallet) {
                userwallet.bitcoinaddress = bitcoinaddress;

                await userwallet.save();

                res.status(200).send({ userwallet });
            } else {
                res.status(404).send({ error: 'no such wallet found for user' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'error updating wallet bitcoin address' });
        }
    }
});

userwalletadmin.post('/userwallet/create/', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;

            if (!userid) {
                res.status(500).send({ error: 'there must be a userid present' });
                return;
            }

            await createuserwallet(userid);

            res.status(200).send({ message: 'user wallet created' });
        } catch (error) {
            res.status(500).send({ error: 'wallet not created' });
        }
    }
});

userwalletadmin.get('/userwallet/getwithdrawal/requests', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { walletid } = req.query;

            const withdrawrequests = await Withdrawalrequest.find({ walletid });

            res.status(200).send({ withdrawrequests });
        } catch (error) {
            res.status(500).send({ error: 'requests not found' });
        }
    }
});

userwalletadmin.post('/userwallet/transaction/create', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;

            const newtransaction = new Transaction({
                userid,
                ...req.body,
            });

            await newtransaction.save();

            res.status(200).send({ newtransaction });
        } catch (error) {
            res.status(500).send({ error: 'error adding transaction' });
        }
    }
});

export default userwalletadmin;