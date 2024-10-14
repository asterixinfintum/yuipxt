import express from 'express';
import Pair from '../../models/pair';


import updatetradingpairsorders from '../updatetradingpairsorders.js';

const pairs = express.Router();

function specifichours(dataArray, hrs) {
    // Check if the array is empty
    if (dataArray.length === 0) return [];

    // Convert the first datetime to a Unix timestamp
    const startTime = Date.parse(dataArray[0].datetime) / 1000;
    const endTime = startTime + hrs * 3600; // 24 hours later in seconds

    // Filter and transform the data
    return dataArray
        .map(data => {
            return {
                time: Date.parse(data.datetime) / 1000,
                value: data.price
            };
        })
        .filter(item => item.time >= startTime && item.time < endTime);
}

function getFirst15MinutesData(dataArray) {
    if (dataArray.length === 0) return [];

    // Convert the first datetime to a Unix timestamp
    const startTime = Date.parse(dataArray[0].datetime) / 1000;
    const endTime = startTime + 15 * 60; // 15 minutes later in seconds

    // Filter and transform the data
    return dataArray
        .map(data => {
            return {
                time: Date.parse(data.datetime) / 1000,
                value: data.price
            };
        })
        .filter(item => item.time >= startTime && item.time < endTime);
}

function filterHourlyItems(dataArray) {
    if (dataArray.length === 0) return [];

    const result = [];
    let lastTimestamp = dataArray[0].time;

    // Always include the first item
    result.push(dataArray[0]);

    dataArray.forEach(item => {
        if (item.time >= lastTimestamp + 3600) {
            result.push(item);
            lastTimestamp = item.time;
        }
    });

    return result;
}

pairs.get('/pairs', async (req, res) => {
    const { baseAssetId, quoteAssetId } = req.query;
    let query = {};

    if (baseAssetId) {
        // Basic validation: Check if baseAssetId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(baseAssetId)) {
            return res.status(400).send({ error: 'Invalid baseAssetId' });
        }
        query.baseAssetId = baseAssetId;
    }

    if (quoteAssetId) {
        // Basic validation: Check if quoteAssetId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(quoteAssetId)) {
            return res.status(400).send({ error: 'Invalid quoteAssetId' });
        }
        query.quoteAssetId = quoteAssetId;
    }

    try {
        const pairs = await Pair.find(query);
        res.status(200).send({ pairs });
    } catch (error) {
        console.error('Error fetching pairs:', error);
        res.status(500).send({ error: 'An error occurred while fetching pairs.' });
    }
});

pairs.get('/pairs/by-base-vtwo', async (req, res) => {
    const { baseAsset } = req.query;

    if (!baseAsset) {
        return res.status(400).send({ error: 'Base currency is required' });
    }

    const pairitems = await Pair.find({ listed: true });
    const result = [];

    //console.log(pairitems.length, 'check here')

    for (const pairitem of pairitems) {
        const pairprice = await pairitem.calculatePrice();
        const pricedifference = await pairitem.calculatepricedifference();

        const item = {
            _id: pairitem._id,
            pair: pairitem.pair,
            price: pairprice,
            pricedifference,
            baseAssetType: pairitem.baseAssetType,
            quoteAssetType: pairitem.quoteAssetType,
            listed: pairitem.listed
        };

        if (pairitem.pair.includes(baseAsset)) {
            result.unshift(item);
        } else {
            result.push(item);
        }
    }

    res.status(200).send({ pairs: result });

    //console.log(pairitems, 'here');
})

pairs.get('/pairs/by-base', async (req, res) => {
    const { baseAsset, assetType } = req.query;

    console.log(baseAsset, 'say hello')

    // Check if baseCurrency is provided
    if (!baseAsset) {
        return res.status(400).send({ error: 'Base currency is required' });
    }

    try {
        let pairs;
        // Find pairs with the specified base currency
        if (!assetType) {
            pairs = await Pair.find({ baseAsset });
        }

        if (assetType) {
            const quoteAssetType = assetType;

            pairs = await Pair.find({ baseAsset, quoteAssetType });
        }

        if (pairs.length === 0) {
            // No pairs found for the given base currency
            return res.status(404).send({ message: 'No pairs found for the specified base currency' });
        }

        const pairsPromises = pairs.map(async pair => {
            const pairprice = await pair.calculatePrice();
            const pricedifference = await pair.calculatepricedifference();
            //console.log(pricedifference);

            return {
                _id: pair._id,
                pair: pair.pair,
                price: pairprice,
                pricedifference,
                baseAssetType: pair.baseAssetType,
                quoteAssetType: pair.quoteAssetType,
                listed: pair.listed,
                inview: pair.inview
            };
        });

        const pairslist = await Promise.all(pairsPromises);

        res.status(200).send({ pairs: pairslist });
    } catch (error) {
        console.error('Error fetching pairs by base currency:', error);
        res.status(500).send({ error: 'An error occurred while fetching pairs.' });
    }
});

pairs.get('/pairs/by-quote', async (req, res) => {
    const { quoteAsset, assetType } = req.query;

    // Check if baseCurrency is provided
    if (!quoteAsset) {
        return res.status(400).send({ error: 'Base currency is required' });
    }

    try {
        let pairs;
        // Find pairs with the specified base currency
        if (!assetType) {
            pairs = await Pair.find({ quoteAsset });
        }

        if (pairs.length === 0) {
            // No pairs found for the given base currency
            return res.status(404).send({ message: 'No pairs found for the specified base currency' });
        }

        res.status(200).send({ pairs });
    } catch (error) {
        console.error('Error fetching pairs by base currency:', error);
        res.status(500).send({ error: 'An error occurred while fetching pairs.' });
    }
});

pairs.get('/pair/orders', async (req, res) => {
    const { pairid } = req.query;

    if (!pairid) {
        return res.status(400).send({ error: 'Base currency is required' });
    }

    try {
        //const pairitem = await Pair.findOne({ _id: pairid });

        const orders = await updatetradingpairsorders(pairid);

        //console.log(orders);

        //const { orders } = pairitem;

        res.status(200).send({ orders });
    } catch {
        res.status(500).send({ error: 'An error occurred while fetching pair orders.' });
    }


});

pairs.get('/pair/pricehistory/hours', async (req, res) => {
    const { pairid } = req.query;

    if (!pairid) {
        return res.status(400).send({ error: 'Base currency is required' });
    }

    try {
        const pairitem = await Pair.findOne({ _id: pairid });
        const getpricehistory = await pairitem.getpricehistory();

        const first24hours = specifichours(getpricehistory, 24)
        const hours = filterHourlyItems(first24hours);

        res.status(200).send({ hours });

    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching price history.' });
    }
});

pairs.get('/pair/pricehistory/fourhours', async (req, res) => {
    const { pairid } = req.query;

    if (!pairid) {
        return res.status(400).send({ error: 'Base currency is required' });
    }

    try {
        const pairitem = await Pair.findOne({ _id: pairid });
        const getpricehistory = await pairitem.getpricehistory();

        const first4hours = specifichours(getpricehistory, 4);
        const hours = filterHourlyItems(first4hours);

        res.status(200).send({ hours });

    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching pair price history.' });
    }
})

pairs.get('/pair/pricehistory/onehour', async (req, res) => {
    const { pairid } = req.query;

    if (!pairid) {
        return res.status(400).send({ error: 'Base currency is required' });
    }

    try {
        const pairitem = await Pair.findOne({ _id: pairid });
        const getpricehistory = await pairitem.getpricehistory();

        const mins = specifichours(getpricehistory, 1);

        res.status(200).send({ mins });

    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching pair price history.' });
    }
});

pairs.get('/pair/pricehistory/fifteenmin', async (req, res) => {
    const { pairid } = req.query;

    if (!pairid) {
        return res.status(400).send({ error: 'Base currency is required' });
    }

    try {
        const pairitem = await Pair.findOne({ _id: pairid });
        const getpricehistory = await pairitem.getpricehistory();

        const mins = getFirst15MinutesData(getpricehistory);

        res.status(200).send({ mins });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching pair price history.' });
    }
});

pairs.get('/pair/pricehistory/hours/candlestick', async (req, res) => {
    const { pairid, candlestickdatalength } = req.query;

    if (!pairid) {
        return res.status(400).send({ error: 'Base currency is required' });
    }

    try {
        const pairitem = await Pair.findOne({ _id: pairid });
        const getpricehistory = await pairitem.getpricehistorycandlestick();

        const candlestickdata = getpricehistory.splice(-candlestickdatalength);
        res.status(200).send({ candlestickdata });

    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching pair price history.' });
    }
});

pairs.get('/pair/pricehistory/mins/candlestick', async (req, res) => {
    const { pairid, candlestickdatalength } = req.query;

    if (!pairid) {
        return res.status(400).send({ error: 'Base currency is required' });
    }

    try {
        const pairitem = await Pair.findOne({ _id: pairid });
        const getpricehistory = await pairitem.getpricehistorycandlestickMins();

        const candlestickdata = getpricehistory.splice(-candlestickdatalength);

        //console.log(candlestickdata)
        res.status(200).send({ candlestickdata });

    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching pair price history.' });
    }
});

export default pairs