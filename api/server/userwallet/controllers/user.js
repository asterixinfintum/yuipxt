import express from 'express';

import authenticateToken from '../../utils/authenticateToken';

import User from '../../models/user';
import Asset from '../../models/asset';
import UserWallet from '../models/wallet';
import Withdrawalrequest from '../models/withdrawalrequest';
import Transaction from '../models/transaction';

const userwalletuser = express.Router();

userwalletuser.get('/userwallet/wallet', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { walletid, assettype, searchquery, start, end } = req.query;

            if (!walletid) {
                res.status(500).send({ error: 'there must be a walletid present' });
                return;
            }

            const userwallet = await UserWallet.findOne({ _id: walletid });

            if (userwallet) {
                let walletbalance;

                if (assettype) {
                    if (start !== 'undefined' && end !== 'undefined') {
                        if (searchquery !== 'undefined') {
                            walletbalance = await userwallet.returnBalance({ assetType: assettype, start, end, searchquery });
                        } else {
                            walletbalance = await userwallet.returnBalance({ assetType: assettype, start, end });
                        }
                    } else {
                        walletbalance = await userwallet.returnBalance({ assetType: assettype });
                    }
                } else {
                    walletbalance = await userwallet.returnBalance();
                }

                res.status(200).send({ walletbalance });
            } else {
                res.status(404).send({ error: 'wallet not found' });
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'error finding walet' });
        }
    }
});

userwalletuser.get('/userwallet/margindashboard', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;

            if (!userid) {
                res.status(500).send({ error: 'there must be a userid present' });
                return;
            }

            const btcAsset = await Asset.findOne({ name: "Bitcoin" });

            const { price } = btcAsset;


            const useritem = await User.findById({ _id: userid });

            const { tradeaccountdebt, tradeaccountmargin, tradeaccountequity } = useritem.tailoreddashboard;

            const tradeaccountdebtInBtc = (tradeaccountdebt / price).toFixed(7);
            const tradeaccountmarginInBtc = (tradeaccountmargin / price).toFixed(7);
            const tradeaccountequityInBtc = (tradeaccountequity / price).toFixed(7);

            res.status(200).json({
                tradeaccountdebtInBtc, 
                tradeaccountmarginInBtc,
                tradeaccountequityInBtc,
                tradeaccountequity,
                tradeaccountdebt,
                tradeaccountmargin
            })
        } catch (error) {
            res.status(500).send({ error: 'error getting wallets' });
        }
    }
});

userwalletuser.get('/userwallet/getall', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;

            if (!userid) {
                res.status(500).send({ error: 'there must be a userid present' });
                return;
            }

            const userwallets = await UserWallet.find({ owner: userid });

            res.status(200).send({ userwallets });
        } catch (error) {
            res.status(500).send({ error: 'error getting wallets' });
        }
    }
});

userwalletuser.get('/userwallet/assetbalance', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { walletid, assetid, assetinitial } = req.query;

            if (assetinitial) {
                if (!walletid || !assetinitial) {
                    res.status(404).send({ error: 'there must be a assetid and a walletid present' });
                    return;
                }

                const userwallet = await UserWallet.findOne({ _id: walletid });

                const balances = userwallet.balances;

                return;
            }

            if (!walletid || !assetid) {
                res.status(404).send({ error: 'there must be a assetid and a walletid present' });
                return;
            }

            const userwallet = await UserWallet.findOne({ _id: walletid });

            const balances = userwallet.balances;

            const assetbalance = balances.find(blc => blc.asset_id === assetid);

            res.status(200).send({ assetbalance: assetbalance ? assetbalance.balance : 0 });
        } catch (error) {
            res.status(500).send({ error: 'error getting asset balance' });
        }
    }
});

userwalletuser.post('/userwallet/request/withdraw', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const withdrawalrequest = {
                userid: req.body.user,
                amount: req.body.amount,
                assetid: req.body.asset,
                walletid: req.body.wallet,
                amountusd: req.body.usdamount,
                bank: req.body.Bank,
                account: req.body.Account,
                cryptoaddress: req.body.cryptoaddress,
                paypalemail: req.body.paypalemail,
            }

            const newwithdrawalrequest = new Withdrawalrequest(withdrawalrequest);

            await newwithdrawalrequest.save();

            res.status(200).send({ message: 'withdrawal request processing' })
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'error processing request' });
        }
    }
});

userwalletuser.get('/userwallet/transactions/', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;

            const transactions = await Transaction.find({ userid });

            res.status(200).send({ transactions })
        } catch (error) {
            res.status(500).send({ error: 'error getting transactions' });
        }
    }
})

export default userwalletuser;