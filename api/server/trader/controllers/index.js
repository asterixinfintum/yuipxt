import express from 'express';

const tradercontroller = express.Router();

import Asset from '../../models/asset';
import Wallet from '../../userwallet/models/wallet';

import allowedpairs from '../utilities/allowedpairs';

import authenticateToken from '../../utils/authenticateToken';

import TradeOrder from '../models/tradeOrder';

tradercontroller.get('/trader/pairs', async (req, res) => {
    try {
        const { assetmenu } = req.query;

        if (assetmenu) {
            const pairs = await allowedpairs();
            const filteredpairs = pairs.filter(pair => pair.type === assetmenu);

            res.status(200).send({ pairs: filteredpairs });
            return;
        }

        res.status(200).send({ pairs: allowedpairs });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred' });
    }
});

tradercontroller.get('/trader/initialpair', async (req, res) => {
    try {
        const { baseassetinitials } = req.query;

        if (baseassetinitials) {
            const pairs = await allowedpairs();
            const initialpair = pairs.filter(pair => pair.left === baseassetinitials)[0];

            res.status(200).send({ initialpair });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'An error occurred' });
    }
});

tradercontroller.get('/trader/getassetbyinitials', async (req, res) => {
    try {
        const { assetinitials } = req.query;

        const asset = await Asset.findOne({ symbol: assetinitials });

        if (asset) {
            res.status(200).send({ asset });
        } else {
            res.status(404).send({ asset: null, message: 'asset not found' });
        }
    } catch (error) {
        res.status(500).send({ error: 'An error occurred' });
    }
});

tradercontroller.get('/trader/getpairprice', async (req, res) => {
    try {
        const { baseassetid, quoteassetid } = req.query;

        const base = await Asset.findOne({ _id: baseassetid });
        const quote = await Asset.findOne({ _id: quoteassetid });

        const pairprice = base.price / quote.price;

        res.status(200).send({ pairprice, baseassetpriceUSD: base.price })
    } catch (error) {
        res.status(500).send({ error: 'An error occurred' });
    }
});

tradercontroller.get('/trader/pairorders', async (req, res) => {
    try {
        const { pairprice } = req.query;

        const pairpricenumber = parseFloat(`${pairprice}`.replace(/[,;]/g, ""));

        const orders = await Promise.all(Array.from({ length: 80 }, async (_, i) => {
            let price = `${parseFloat(pairpricenumber.toFixed(4))}`
            let random = generateRandomIntegerBetween(3, 8);
            let randomtwo = generateRandomIntegerBetween(3, 8);
            let randomthree = generateRandomIntegerBetween(3, 8);
            let randomfour = generateRandomIntegerBetween(3, 8);
            let randomfive = generateRandomIntegerBetween(3, 8);
            let randomsix = generateRandomIntegerBetween(3, 8);

            const pricenumber = Number(`${price}${random}${randomtwo}`);
            const amount = generateRandomIntegerBetween(1, 40)

            const side = i % 2 === 0 ? 'buy' : 'sell';

            const order = {
                price: `${price}${random}${randomtwo}`,
                amount: `${amount}.${randomthree}${randomfour}${randomfive}${randomsix}`,
                total: (pricenumber * amount).toFixed(3), side
            };


            return order;
        }));

        const sellorders = orders.filter(order => order.side === 'sell');
        const buyorders = orders.filter(order => order.side === 'buy');

        res.status(200).send({ buyorders, sellorders });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred' });
    }
});

tradercontroller.get('/trader/markettrades', async (req, res) => {
    try {
        const { pairprice } = req.query;

        const pairpricenumber = parseFloat(`${pairprice}`.replace(/[,;]/g, ""));

        const marketorders = await Promise.all(Array.from({ length: 40 }, async (_, i) => {
            let price = `${parseFloat(pairpricenumber.toFixed(4))}`
            let random = generateRandomIntegerBetween(3, 8);
            let randomtwo = generateRandomIntegerBetween(3, 8);
            let randomthree = generateRandomIntegerBetween(3, 8);
            let randomfour = generateRandomIntegerBetween(3, 8);
            let randomfive = generateRandomIntegerBetween(3, 8);
            let randomsix = generateRandomIntegerBetween(3, 8);

            const pricenumber = Number(`${price}${random}${randomtwo}`);
            const amount = generateRandomIntegerBetween(1, 40)


            const side = Math.random() < 0.5 ? 'buy' : 'sell';

            const order = {
                price: `${price}${random}${randomtwo}`,
                amount: `${amount}.${randomthree}${randomfour}${randomfive}${randomsix}`,
                total: (pricenumber * amount).toFixed(3),
                side
            };

            return order;
        }));

        res.status(200).send({ marketorders });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred' });
    }
});

tradercontroller.get('/trader/headerdetails', async (req, res) => {
    try {
        const { assetid, pairprice } = req.query;

        const min = 1444.03;
        const max = 25796.50;

        let baseassetvol;
        let quoteassetvol;
        let baseassethigh;
        let baseassetlow;
        let twentyfourhrchange;
        let baseassetprice;

        const asset = await Asset.findOne({ _id: assetid });

        baseassetprice = asset.price;
        baseassetvol = generateRandomIntegerBetween(min, max).toFixed(2);
        quoteassetvol = generateRandomIntegerBetween(min, max).toFixed(2);
        baseassethigh = adjustNumber(pairprice, 'add')
        baseassetlow = adjustNumber(pairprice, 'subtract')

        res.status(200).send({ baseassetprice, baseassetvol, quoteassetvol, baseassethigh, baseassetlow });

    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'An error occurred' });
    }
});

tradercontroller.post('/trader/createorder', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { tradetype, ordertype } = req.query;

            if (tradetype === 'automatic') {

                const _id = req.body.orderdetails.assetbalancededucted;

                const asset = await Asset.findOne({ _id });
                const wallet = await Wallet.findOne({ _id: req.body.wallet });

                const tradeorder = new TradeOrder(req.body);

                tradeorder.orderdetails.totalinvestment = tradeorder.orderdetails.total * asset.price;

                await tradeorder.save();

                if (asset) {
                    const assetid = getStringFromObjectId(asset._id);
                    const assetbalance = wallet.balances.find(blc => blc.asset_id === assetid);
                    const amountdeductable = tradeorder.orderdetails.total;

                    if (assetbalance) {
                        const balance = assetbalance.balance;

                        const newbalance = balance - parseFloat(amountdeductable);

                        assetbalance.balance = newbalance;

                        const assetbalanceupdate = [assetbalance, ...wallet.balances.filter(blc => blc.asset_id !== assetid)];

                        const update = {
                            $set: {
                                balances: assetbalanceupdate
                            }
                        };

                        const options = { new: true, upsert: true };

                        Wallet.findOneAndUpdate({ _id: req.body.wallet }, update, options)
                            .then(updatedWallet => {
                                if (updatedWallet) {
                                    //console.log('Successfully updated wallet:', updatedWallet);
                                    res.status(201).send({ message: 'order created', tradeorder, updatedWallet });
                                } else {
                                    console.log('No wallet matches the provided query.');
                                }
                            })
                            .catch(err => console.error(`Failed to find and update wallet: ${err}`));
                    }
                } else {
                    res.status(404).send({ message: 'not found' });
                    return;
                }
                return;
            }

            if (ordertype === 'Market') {
                const marketorder = req.body;

                const { orderdetails } = marketorder;

                const assetfrom = await Asset.findOne({ _id: orderdetails.assetfrom });
                const assetto = await Asset.findOne({ _id: orderdetails.assetto });

                if (assetfrom && assetto) {
                    const amountfrom = parseFloat(orderdetails.amountfrom);
                    const amountto = parseFloat(orderdetails.amountto);
                    const walletid = marketorder.wallet;

                    const wallet = await Wallet.findOne({ _id: walletid });
                    const balances = wallet.balances.filter(blc => blc && blc !== null && blc.asset_id);

                    const balancefrom = balances.find(blc => blc.asset_id === getStringFromObjectId(assetfrom._id));

                    balancefrom.balance = balancefrom.balance - amountfrom;

                    const balanceto = balances.find(blc => blc.asset_id === getStringFromObjectId(assetto._id));
                    let assettobalance;
                    let newbalance;

                    if (balanceto) {
                        balanceto.balance = balanceto.balance + amountto;
                        assettobalance = balanceto;

                        newbalance = [
                            ...balances.filter(blc => blc.asset_id !== getStringFromObjectId(assetfrom._id) && blc.asset_id !== getStringFromObjectId(assetto._id)),
                            balanceto, balancefrom
                        ]
                    } else {
                        assettobalance = {
                            asset_id: getStringFromObjectId(assetto._id),
                            balance: amountto,
                            assetname: assetto.name
                        }

                        newbalance = [...balances.filter(blc => blc.asset_id !== getStringFromObjectId(assetfrom._id)), balancefrom, assettobalance];
                    }

                    const update = {
                        $set: {
                            balances: newbalance
                        }
                    };

                    const options = { new: true, upsert: true };

                    const tradeorder = new TradeOrder(req.body);

                    await tradeorder.save();

                    Wallet.findOneAndUpdate({ _id: req.body.wallet }, update, options)
                        .then(updatedWallet => {
                            if (updatedWallet) {
                                //console.log('Successfully updated wallet:', updatedWallet);
                                res.status(201).send({ message: 'order created', tradeorder, updatedWallet });
                            } else {
                                console.log('No wallet matches the provided query.');
                            }
                        })
                        .catch(err => console.error(`Failed to find and update wallet: ${err}`));
                } else {
                    res.status(404).send({ message: 'assets not found' });
                }

                return;
            }

            const tradeorder = new TradeOrder(req.body);

            //console.log(tradeorder);
            await tradeorder.save();
            res.status(201).send({ message: 'order created', tradeorder });
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'an error occured' });
        }
    }
});

tradercontroller.get('/trader/gettradeorders', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { wallet } = req.query;

            const tradeorders = await TradeOrder.find({ wallet });

            res.status(201).send({ message: 'orders found', tradeorders });
        } catch (error) {
            console.log(error)
        }
    }
});

tradercontroller.put('/trader/cancelorder', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { orderid } = req.query;

            const tradeorder = await TradeOrder.findOne({ _id: orderid });

            tradeorder.active = false;
            tradeorder.state = 'closed';

            await tradeorder.save();

            res.status(201).send({ message: 'orders closed', tradeorder });
        } catch (error) {
            console.log(error)
        }
    }
});

tradercontroller.get('/trader/getautotrades', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { orderid } = req.query;

            const tradeorder = await TradeOrder.findOne({ _id: orderid });
            const assetitem = await Asset.findOne({ symbol: getBaseSymbol(tradeorder.tradepair) });

            const orders = generateOrdersDatesSixSecondsApart(tradeorder.orderdetails.total, parseFloat(assetitem.price));

            res.status(201).send({ orders });
        } catch (error) {
            console.log(error)
        }
    }
});

function generateOrdersDatesSixSecondsApart(amnt, assetprice) {
    const orders = [];
    const now = new Date();

    for (let i = 0; i < 8; i++) {
        // Create a new date for each iteration, 6 seconds apart
        const date = new Date(now.getTime() - i * 6 * 1000); // 1000 milliseconds in a second
        const amount = generateRandomIntegerBetween(1, amnt);
        const price = (generateRandomNumber() * amnt) * assetprice;
        const side = Math.random() < 0.5 ? 'buy' : 'sell';

        const cleaneddate = new Date(date);

        const humanReadableDate = cleaneddate.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short'
        });

        orders.push({ date: humanReadableDate, amount, price, side });
    }

    return orders;
}

function generateRandomNumber() {
    const min = 0.005;
    const max = 0.8;
    return Math.random() * (max - min) + min;
}

function getBaseSymbol(pair) {
    return pair.split('/')[0];
}

function generateRandomIntegerBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function adjustNumber(number, operation) {
    // Define the proportion of the adjustment relative to the number's size
    const proportion = 0.05; // 5% for demonstration, adjust as needed

    // Calculate the adjustment amount
    const adjustment = number * proportion;

    let result;

    // Perform the operation
    if (operation === 'add') {
        result = number + adjustment;
    } else if (operation === 'subtract') {
        result = number - adjustment;
    } else {
        throw new Error('Invalid operation. Use "add" or "subtract".');
    }

    // Round the result to 4 decimal places and ensure the result is a number
    return parseFloat(result).toFixed(4);
}

function generateRandomPercentageWithDirectionAndColor() {
    // Generate a random percentage between 1 and 11
    const percentage = Math.random() * 10 + 1;

    // Randomly choose 'up' or 'down'
    const isUp = Math.random() < 0.5;
    const direction = isUp ? '#0ecb81' : 'down';

    // Format the percentage with the correct sign and precision
    const formattedPercentage = isUp
        ? `+${percentage.toFixed(2)}%`
        : `-${percentage.toFixed(2)}%`;

    // Assign colors
    const color = isUp ? 'green' : '#f6465d';

    // Return an object with the formatted percentage, direction, and color
    return {
        percentage: formattedPercentage,
        direction,
        color
    };
}

function getStringFromObjectId(objectId) {
    return objectId.toString();
}

export default tradercontroller;


