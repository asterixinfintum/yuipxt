import express from 'express';
import jwt from 'jsonwebtoken';

import User from '../../models/user';
import Agent from '../../models/admin';
import TokenTracker from '../../models/tokentracker';
import Wllt from '../../wallet/models/wllt';
import Asset from '../../models/asset';
import AssetBlc from '../../wallet/models/assetblc';
import Pair from '../../models/pair';

import UserWallet from '../../userwallet/models/wallet';
import TraderOrder from '../../trader/models/tradeOrder';

const { formatDistanceToNow } = require('date-fns');

const admin = express.Router();

import generatetradingpairs from '../../functions/generatetradingpairs';
import addpairquotes from '../../functions/addpairquotes';

import updatecommodities from '../../trade/commodities/updatecommodities';

import authenticateToken from '../../utils/authenticateToken';

const pairstrings = [
    'UNI/ETH', 'UNI/USDC', 'UNI/BTC', 'UNI/BNB', 'XRP/USDT', 'XRP/BTC', 'XRP/USD',
    'XRP/BNB', 'XRP/ETH', 'BTC/USD', 'BTC/USDT', 'BTC/BNB', 'ETH/USD', 'ETH/USDT',
    'ETH/USDC', 'ETH/BTC', 'ETH/TRX', 'XMR/BTC', 'XMR/USD', 'XMR/USDT', 'XMR/USDC',
    'XMR/ETH', 'XMR/BNB', 'DOGE/USDT', 'DOGE/USD', 'DOGE/BTC', 'DOGE/USDC', 'POLY/USD',
    'POLY/USDT', 'POLY/BTC', 'ADA/USDT', 'ADA/USD', 'ADA/BTC', 'ADA/ETH', 'ADA/BNB',
    'ADA/USDC', 'BAT/USDT', 'BAT/USD', 'BAT/BTC', 'BAT/ETH', 'BAT/USD', 'TRX/USDT',
    'TRX/USD', 'TRX/ETH', 'TRX/BTC', 'TRX/XRP', 'TRX/ADA', 'BNB/USDT', 'BNB/USD',
    'BNB/USDC', 'BNB/ETH', 'BNB/TRX', 'BNB/BTC', 'EOS/USDT', 'EOS/USD', 'EOS/USDT',
    'EOS/BTC', 'EOS/ETH', 'DASH/USDT', 'DASH/BTC', 'DASH/USDT', 'DASH/USDC', 'DASH/ETH',
    'MKR/USDT', 'MKR/USD', 'MKR/BTC', 'MKR/ETH', 'NEO/USDT', 'NEO/USD', 'NEO/BTC',
    'NEO/ETH', 'NEO/TRX', 'LINK/USD', 'LINK/USDT', 'LINK/BTC', 'LINK/ETH', 'LINK/TRX',
    'BCH/USD', 'BCH/USDT', 'BCH/BTC', 'BCH/ETH', 'LTC/USD', 'LTC/USDT', 'LTC/BTC',
    'LTC/ETH', 'SNX/USD', 'SNX/USDT', 'SNX/BTC', 'SNX/ETH', 'XLM/XRP', 'XLM/USD',
    'XLM/USDT', 'XLM/BTC', 'XLM/ETH', 'T/USD', 'TSLA/USD', 'FB/USD', 'JPM/USD',
    'VALE/USD', 'C/USD', 'GE/USD', 'MSFT/USD', 'GM/USD', 'NIO/USD', 'INTC/USD',
    'NOK/USD', 'NVDA/USD', 'KO/USD', 'AAL/USD', 'WFC/USD', 'F/USD', 'AAPL/USD',
    'BAC/USD', 'CCL/USD', 'BA/USD', 'UBER/USD', 'M/USD', 'AMD/USD', 'DIS/USD',
    'PFE/USD', 'SNAP/USD', 'XOM/USD', 'WHEAT/USD', 'NATURAL_GAS/USD', 'BRENT/USD',
    'COTTON/USD', 'COPPER/USD', 'ALUMINIUM/USD', 'COFFEE/USD', 'CORN/USD', 'SUGAR/USD',
    'WTI/USD', "Tin/USD",
    "Tin/USDT",
    "Gold/USD",
    "Nickel/USD",
    "Ethanol/USD",
    "Palladium/USD",
    "Silver/USD",
    "Heating Oil/USD",
    "Platinum/USD",
    "Coal/USD",
    "RBOB Gasoline/USD",
    "Uranium/USD",
    "Oil (Brent)/USD",
    "Oil (WTI)/USD",
    "Aluminium/USD",
    "Lead/USD",
    "Iron Ore/USD",
    "Lean Hog/USD",
    "Oats/USD",
    "Lumber/USD",
    "Cocoa/USD",
    "Live Cattle/USD",
    "Feeder Cattle/USD",
    "Milk/USD",
    "Milk/USDT",
    "Orange Juice/USD",
    "Palm Oil/USD",
    "Rapeseed/USD",
    "Rice/USDT",
    "Rice/USD",
    "Zinc/USD",
    "Soybean Meal/USD",
    "Soybeans/USD",
    "Soybean Oil/USD",
    "Soybean Oil/USD"
];

async function relistpairs() {
    for (const pairstring of pairstrings) {
        const pair = await Pair.findOne({ pair: pairstring });

        if (pair) {
            pair.listed = true;

            pair.save();
        }
    }
}

admin.post('/admin/create', async (req, res) => {
    try {
        const receivedCredentials = req.body;

        const newagent = new Agent(receivedCredentials);

        await newagent.save();

        res.json({
            message: 'Agent saved successfully.',
            newagent
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

admin.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const agent = await Agent.findOne({ username, password });

        if (!agent) {
            return res.sendStatus(401); // Unauthorized
        }

        const payload = {
            _id: agent._id,
            username: agent.username
        };

        const token = jwt.sign(payload, process.env.secretKeyJWT);

        const newtokentracker = new TokenTracker({ token, type: 'agent', unid: agent._id });

        await newtokentracker.save();

        agent.token = token;
        await agent.save();

        res.status(200).json({
            message: 'Login successful.',
            token,
            agentdata: {
                username: agent.username,
                _id: agent._id
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

admin.get('/admin/all', async (req, res) => {
    try {
        const { master } = req.query;

        if (master !== process.env.masterKey) {
            return res.sendStatus(401); // Unauthorized
        }

        const agents = await Agent.find();

        res.status(200).json({ agents });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during agents fetch.' });
    }
});

admin.put('/admin/edit', async (req, res) => {
    try {
        const { master, agentid } = req.query;
        const { password } = req.body;

        if (master !== process.env.masterKey) {
            return res.sendStatus(401); // Unauthorized
        }

        if (password) {
            const agent = await Agent.findOne({ _id: agentid });

            if (agent) {
                const tokentracker = await TokenTracker.find({ token: agent.token, unid: agent._id });

                if (tokentracker.length) {
                    for (const tracker of tokentracker) {
                        await TokenTracker.deleteToken(tracker.token);
                    }
                }

                agent.password = password;
                agent.token = '';

                await agent.save();

                const updatedagent = await Agent.findOne({ _id: agentid });

                res.json({
                    message: 'Agent updated successfully.',
                    updatedagent
                });
            } else {
                res.status(404).json({ message: 'Agent not found.' });
            }

        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during update.' });
    }
});

admin.delete('/admin/deleteall', async (req, res) => {
    try {
        const { master } = req.query;

        if (master !== process.env.masterKey) {
            return res.sendStatus(401); // Unauthorized
        }

        await Agent.deleteMany({});

        await TokenTracker.deleteTokensByType('agent');

        res.json({
            message: 'Agent deleted successfully.'
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during delete.' });
    }
});

admin.get('/allusers', authenticateToken, async (req, res) => {
    try {
        const users = await User.find();
        const useritems = [];

        users.forEach(user => {
            const userObject = user.toObject();

            if (userObject.lastOnline) {
                const lastseen = formatDistanceToNow(new Date(user.lastOnline), { addSuffix: true });
                userObject.lastseen = lastseen;
            }

            useritems.push(userObject); //
        })

        res.status(200).send({ users: useritems });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

admin.get('/user', authenticateToken, async (req, res) => {
    try {
        const { id } = req.query

        const user = await User.findOne({ _id: id });

        const userObject = user.toObject();

        if (userObject.lastOnline) {
            const lastseen = formatDistanceToNow(new Date(user.lastOnline), { addSuffix: true });
            userObject.lastseen = lastseen;
        }

        res.status(200).send({ user: userObject });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

admin.get('/userwallets', authenticateToken, async (req, res) => {
    try {
        const { id } = req.query

        const userwallets = await Wllt.find({ ownerId: id });
        res.status(200).send({ userwallets });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

admin.get('/user/assets', authenticateToken, async (req, res) => {
    const { id, wallet } = req.query;

    try {
        const crypto = await Asset.find({ assetType: 'crypto' });
        const commodities = await Asset.find({ assetType: 'commodity' });
        const stocks = await Asset.find({ assetType: 'stock' });
        const fiat = await Asset.find({ assetType: 'fiat' });
        const userwallet = await Wllt.findOne({ _id: wallet });

        const processAssets = async (assets) => {
            const assetPromises = assets.map(async asset => {
                const assetid = asset._id.toString();
                const asstBlc = await AssetBlc.findOne({ assetid, wallet: userwallet._id });
                return { ...asset._doc, asstBlc: asstBlc ? asstBlc.balance : 0 };
            });
            return await Promise.all(assetPromises);
        };

        const cryptoblc = await processAssets(crypto);
        const commoditiesblc = await processAssets(commodities);
        const stocksblc = await processAssets(stocks);
        const fiatblc = await processAssets(fiat);

        // Send response back to client
        res.status(200).json({
            crypto: cryptoblc,
            commodities: commoditiesblc,
            stocks: stocksblc,
            fiat: fiatblc,
            userwallet
        });


    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing request');
    }
});

admin.post('/user/asset/add', authenticateToken, async (req, res) => {
    try {
        const { balanceupdate } = req.body;
        const { wallet, assetid } = req.query;

        const userwallet = await Wllt.findOne({ _id: wallet });

        await userwallet.deposit(balanceupdate, assetid)

        res.status(200).json({
            message: 'done'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing request');
    }
})

admin.post('/user/asset/subtract', authenticateToken, async (req, res) => {
    try {
        const { balanceupdate } = req.body;
        const { wallet, assetid } = req.query;

        const userwallet = await Wllt.findOne({ _id: wallet });

        await userwallet.withdraw(balanceupdate, assetid);

        res.status(200).json({
            message: 'done'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing request');
    }
});

admin.post('/user/accounttypeupdate/update', authenticateToken, async (req, res) => {
    try {
        const { id } = req.query;
        const { accounttypeupdate } = req.body;

        const user = await User.findOne({ _id: id });

        user.accountplan = accounttypeupdate;
        await user.save();

        res.status(200).json({
            message: 'done'
        });
    } catch (error) {
        res.status(500).send('Error processing request');
    }
});

admin.post('/user/spotbtcaddress/update', authenticateToken, async (req, res) => {
    try {
        const { id } = req.query;
        const { spotbtcaddress } = req.body;

        const user = await User.findOne({ _id: id });

        user.spotbtcaddress = spotbtcaddress;
        await user.save();

        res.status(200).json({
            message: 'done'
        });
    } catch (error) {
        res.status(500).send('Error processing request');
    }
})

admin.post('/user/marginbtcaddress/update', authenticateToken, async (req, res) => {
    try {
        const { id } = req.query;
        const { marginbtcaddress } = req.body;

        const user = await User.findOne({ _id: id });

        user.marginbtcaddress = marginbtcaddress;
        await user.save();

        res.status(200).json({
            message: 'done'
        });
    } catch (error) {
        res.status(500).send('Error processing request');
    }
});

admin.get('/jhgchdh/generatetradingpair', async (req, res) => {
    try {
        await generatetradingpairs();

        res.status(200).json({ message: 'trading pairs generated' });
    } catch (error) {
        res.status(500).send('Error processing request');
    }
});

admin.get('/jhgchdh/addpairquotes', async (req, res) => {
    try {
        await addpairquotes();

        res.status(200).json({ message: 'pair quotes generated' });
    } catch (error) {
        res.status(500).send('Error processing request');
    }
});

admin.get('/jhgchdh/updatecommoditydatabase', async (req, res) => {
    try {
        await updatecommodities();

        res.status(200).json({ message: 'commodity database updated successfully' });
    } catch (error) {
        res.status(500).send('error in commodity database update');
    }
});

admin.post('/jhgchdh/pair/delist', async (req, res) => {
    try {
        const { pairid } = req.query;

        const pairitems = await Pair.find({ _id: pairid });

        if (pairitems.length === 0) {
            return res.status(404).json({ message: 'No matching pairs found to update' });
        }

        for (const pairitem of pairitems) {
            pairitem.listed = false;
            await pairitem.save();
        }

        res.status(200).json({ message: `${pairitems.length} pair delisted successfully` });
    } catch (error) {
        console.error(error); // It's often useful to log the error for debugging
        res.status(500).send('Error in pair database update');
    }
});

admin.post('/jhgchdh/pair/relist', async (req, res) => {
    try {
        const { pairid } = req.query;

        const pairitems = await Pair.find({ _id: pairid });

        if (pairitems.length === 0) {
            return res.status(404).json({ message: 'No matching pairs found to update' });
        }

        for (const pairitem of pairitems) {
            pairitem.listed = true;
            await pairitem.save();
        }

        res.status(200).json({ message: `${pairitems.length} pair relisted successfully` });
    } catch (error) {
        console.error(error); // It's often useful to log the error for debugging
        res.status(500).send('Error in pair database update');
    }
});

admin.post('/jhgchdh/asset/delist', async (req, res) => {
    try {
        const { assetid } = req.query;

        const assets = await Asset.find({ _id: assetid });

        if (assets.length === 0) {
            return res.status(404).json({ message: 'No matching pairs found to update' });
        }

        for (const asset of assets) {
            asset.listed = false;
            await asset.save();
        }

        res.status(200).json({ message: `${assets.length} asset delisted successfully` });

    } catch (error) {
        res.status(500).send('error in asset database update');
    }
});

admin.post('/jhgchdh/asset/relist', async (req, res) => {
    try {
        const { assetid } = req.query;

        const assets = await Asset.find({ _id: assetid });

        if (assets.length === 0) {
            return res.status(404).json({ message: 'No matching pairs found to update' });
        }

        for (const asset of assets) {
            asset.listed = true;
            await asset.save();
        }

        res.status(200).json({ message: `${assets.length} asset relisted successfully` });

    } catch (error) {
        res.status(500).send('error in asset database update');
    }
});

admin.post('/jhgchdh/pairs/relistings', async (req, res) => {
    try {
        relistpairs();

        res.status(200).json({ message: `relistings done` });
    } catch (error) {
        res.status(500).send('error triggering relistings');
    }
});

admin.put('/jhgchdh/tradeorder/update', authenticateToken, async (req, res) => {
    try {
        const { orderid } = req.query;
        const { filled, profit, loss, active, state } = req.body;

        const filter = { _id: orderid };

        const update = {
            filled: parseFloat(filled),
            profit: parseFloat(profit),
            loss: parseFloat(loss),
            active: toBoolean(active),
            state
        };

        const options = { new: true };

        TraderOrder.findOneAndUpdate(filter, update, options, (err, doc) => {
            if (err) {
                res.status(500).send('error updating tradeorder');
            }

            res.status(200).send({ message: 'order updated' });
        });
    } catch (error) {
        res.status(500).send('error updating tradeorder');
    }
});

admin.put('/jhgchdh/assetitem/update', authenticateToken, async (req, res) => {
    try {
        const { assetid } = req.query;
        const { priceupdate } = req.body;

        const filter = { _id: assetid };

        const update = {
            price: priceupdate
        }

        const options = { new: true };

        Asset.findOneAndUpdate(filter, update, options, (err, doc) => {
            if (err) {
                res.status(500).send('error updating asset');
            }

            res.status(200).send({ message: 'asset updated' });
        });
    } catch (error) {
        res.status(500).send('error updating asset');
    }
});

function toBoolean(input) {
    if (typeof input === 'string') {
        if (input.toLowerCase() === 'true') return true;
        if (input.toLowerCase() === 'false') return false;
    }
    return !!input;
}


export default admin;