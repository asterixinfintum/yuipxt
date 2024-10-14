import express from 'express';
import Order from '../models/order';
import AutoTrade from '../models/autotrade';
import ExecutedTrade from '../models/executedtrade';

import Wallet from '../../wallet/models/wllt';
import Asset from '../../models/asset';
import AutoTradePair from '../models/autotradepair';

import authenticateToken from '../../utils/authenticateToken';

const orders = express.Router();

orders.post('/order/market', authenticateToken, async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(404).send({ error: 'User not found.' });
    }

    try {
        const ownerId = req.user._id;
        const {
            tradingPair, pairId, type, side, total, price, quantity,
            assettobuy, assettosell, wallettype, wallet,
            assettobuytype, assettoselltype, fees
        } = req.body;

        const order = new Order({
            userId: ownerId,
            tradingPair, pairId, type, side, total, price, quantity,
            assettobuy, assettosell, wallettype, wallet,
            assettobuytype, assettoselltype, fees
        });

        await order.save();
        await order.executeorder({ percentage: 100 });

        res.status(201).send({ message: 'Order created successfully.' });
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(400).send({ error: 'An error occurred while processing the order.' });
    }
});

orders.post('/order/limit', authenticateToken, async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(404).send({ error: 'User not found.' });
    }

    try {
        const ownerId = req.user._id;
        const {
            tradingPair, pairId, type, side, total, limitprice, quantity,
            assettobuy, assettosell, wallettype, wallet,
            assettobuytype, assettoselltype, fees
        } = req.body;

        const order = new Order({
            userId: ownerId,
            tradingPair, pairId, type, side, total, price: limitprice, quantity,
            assettobuy, assettosell, wallettype, wallet,
            assettobuytype, assettoselltype, fees,
            limitPrice: limitprice // Assuming you need this separately
        });

        await order.save();

        res.status(201).send({ message: 'Order created successfully.' });
    } catch (error) {
        console.error('Error processing limit order:', error);
        res.status(400).send({ error: 'An error occurred while processing the limit order.' });
    }
});

orders.post('/order/stoplimit', authenticateToken, async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(404).send({ error: 'User not found.' });
    }

    try {
        const ownerId = req.user._id;
        const {
            tradingPair, pairId, type, side, total, limitprice, stopprice, quantity,
            assettobuy, assettosell, wallettype, wallet,
            assettobuytype, assettoselltype, fees
        } = req.body;

        const order = new Order({
            userId: ownerId,
            tradingPair, pairId, type, side, total, price: limitprice, quantity,
            assettobuy, assettosell, wallettype, wallet,
            assettobuytype, assettoselltype, fees,
            limitPrice: limitprice,
            stopPrice: stopprice
        });

        await order.save();

        res.status(201).send({ message: 'Order created successfully.' });
    } catch (error) {
        console.error('Error processing stop limit order:', error);
        res.status(400).send({ error: 'An error occurred while processing the stop limit order.' });
    }
});

orders.post('/order/automatictrade', authenticateToken, async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(404).send({ error: 'User not found.' });
    }

    try {
        const ownerId = req.user._id;
        const {
            tradingPair, total, price, assettobuy, assettosell,
            assettobuytype, assettoselltype, wallettype, wallet,
            fees, quantity
        } = req.body;

        const autotrade = new AutoTrade({
            userId: ownerId,
            tradingPair, total, price, assettobuy, assettosell,
            assettobuytype, assettoselltype, wallettype, wallet,
            fees, quantity
        });

        await autotrade.save();

        const walletitem = await Wallet.findOne({ _id: wallet });

        await walletitem.withdraw(total, assettosell);

        const autotradepair = new AutoTradePair({ tradingPair });

        await autotradepair.save();

        //console.log(autotrade)

        res.status(201).send({ message: 'Auto trade created successfully.' });
    } catch (error) {
        console.error('Error creating auto trade:', error);
        res.status(400).send({ error: 'An error occurred while creating the auto trade.' });
    }
});

orders.get('/orders', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const userId = req.user._id;
            const userOrders = await Order.find({ userId });
            res.status(200).send({ orders: userOrders });
        } catch (error) {
            res.status(500).send({ message: 'Error fetching orders', error: error.message });
        }
    } else {
        res.status(404).send({ message: 'User not found' });
    }
});

orders.get('/trades', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const userId = req.user._id;
            const executedtrades = await ExecutedTrade.find({ userId });
            res.status(200).send({ executedtrades });
        } catch (error) {
            res.status(500).send({ message: 'Error fetching trades', error: error.message });
        }
    } else {
        res.status(404).send({ message: 'User not found' });
    }
});

orders.put('/order/cancel', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        const { orderid } = req.query;
        const orderitem = await Order.findOne({ _id: orderid });

        await orderitem.cancel();

        res.status(200).send({ message: 'order cancelled' });
    } else {
        res.status(404).send({ message: 'Error in found' });
    }
});

orders.put('/autotrade/cancel', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        const { autotradeid } = req.query;
        const autotradeitem = await AutoTrade.findOne({ _id: autotradeid });

        await autotradeitem.cancel();

        res.status(200).send({ message: 'auto trade cancelled' });
    } else {
        res.status(404).send({ message: 'Error in found' });
    }
})

orders.get('/autotrades', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const userId = req.user._id;
            const autotrades = await AutoTrade.find({ userId });
            res.status(200).send({ autotrades });
        } catch (error) {
            res.status(500).send({ message: 'Error fetching auto trades', error: error.message });
        }
    } else {
        res.status(404).send({ message: 'User not found' });
    }
});


orders.get('/orderplayground', async (req, res) => {
    const id = '650f3a7b1c2829c7bdbf9bdf';
    try {
        const userOrder = await Order.find({ _id: id });
        const orderItem = userOrder[0];
        const { walletasset, order, executedtrade } = await orderItem.executesell(0.01, 0.16);
        res.status(201).send({ walletasset, order, executedtrade });
    } catch (error) {
        res.status(500).send({ message: 'Error executing sell', error: error.message });
    }
});

orders.delete('/allorders', async (req, res) => {
    try {
        await deleteAllOrders();
        res.status(200).send({ message: 'All Orders have been deleted.' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting orders', error: error.message });
    }
});

async function deleteAllOrders() {
    await Order.deleteMany({}); // No need for try-catch here; let the caller handle the error
}

export default orders;