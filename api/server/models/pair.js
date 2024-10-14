const mongoose = require('mongoose');
const { Schema } = mongoose;

import Asset from './asset';
import PriceHistory from './pricehistory';

function parseNumber(str) {
    // Remove commas from the string
    const numericString = str.replace(/,/g, '');
    // Parse the string to a floating point number
    return parseFloat(numericString);
}

function calculatePercentageChange(originalValue, newValue) {
    const difference = newValue - originalValue;
    const percentageChange = (difference / originalValue) * 100;
    // Format the result with a '+' sign for positive changes
    return (percentageChange > 0 ? "+" : "") + percentageChange.toFixed(2) + '%';
}

function getRandomPrice(basePrice, maxVariation) {
    // Generate a random number within the range of -maxVariation to +maxVariation
    const variation = (Math.random() * maxVariation * 2) - maxVariation;

    // Add the variation to the base price and ensure the result is not negative
    const newPrice = Math.max(0, basePrice + variation).toFixed(8);

    return parseFloat(newPrice); // Convert string back to a float, with precision for small values
}

function calculateOHLC(data) {
    // Helper function to extract hour from datetime
    const getHour = (datetime) => {
        const date = new Date(datetime);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
    };

    // Group data by hour
    const groupedData = data.reduce((acc, entry) => {
        const hour = getHour(entry.datetime).getTime();
        if (!acc[hour]) {
            acc[hour] = { prices: [], open: null, close: null };
        }
        acc[hour].prices.push(entry.price);
        if (acc[hour].open === null) {
            acc[hour].open = entry.price;
        }
        acc[hour].close = entry.price;
        return acc;
    }, {});

    // Calculate OHLC for each hour
    const ohlcData = Object.keys(groupedData).map((hour) => {
        const prices = groupedData[hour].prices;
        return {
            time: parseInt(hour) / 1000,
            open: groupedData[hour].open,
            high: Math.max(...prices),
            low: Math.min(...prices),
            close: groupedData[hour].close
        };
    });

    return ohlcData;
}

function grouphours(subjectgroup) {
    function getBeforeColon(str) {
        return str.split(':')[0];
    }

    function returnhigh(hrgroup) {
        if (!hrgroup.length) return null;

        let highest = hrgroup[0];

        hrgroup.forEach(item => {
            if (item.price > highest.price) {
                highest = item;
            }
        });

        return highest;
    }

    function returnlow(hrgroup) {
        if (!hrgroup.length) return null;

        let lowest = hrgroup[0];

        hrgroup.forEach(item => {
            if (item.price < lowest.price) {
                lowest = item;
            }
        });

        return lowest;
    }

    function returnopen(hrgroup) {
        return hrgroup[0]
    }

    function returnclose(hrgroup) {
        return hrgroup[hrgroup.length - 1]
    }

    function convertToMilliseconds(dateTimeStr) {
        const date = new Date(dateTimeStr);
        return date.getTime();
    }

    const hourgroups = {}
    const hourgroupsarray = [];
    const final = [];

    subjectgroup.forEach(item => {
        const hourgroup = getBeforeColon(item.time);

        if (!hourgroups[hourgroup]) {
            hourgroups[hourgroup] = [];
        }

        hourgroups[hourgroup].push(item)
    });

    for (let key in hourgroups) {
        hourgroupsarray.push(hourgroups[key]);
    }

    hourgroupsarray.forEach(hrgp => {
        const item = {
            time: convertToMilliseconds(hrgp[0].datetime),
            high: returnhigh(hrgp).price,
            low: returnlow(hrgp).price,
            open: returnopen(hrgp).price,
            close: returnclose(hrgp).price,
            //basetime: hrgp[0].datetime
        }

        final.push(item);
    })

    return final;
}

function calculateOHLCMinute(data) {
    function getobjectkey(object, key) {
        return object[`${key}`]
    }

    function getDateString(dateTimeStr) {
        return dateTimeStr.split(' ')[0];
    }

    function getTimeString(dateTimeStr) {
        return dateTimeStr.split(' ')[1];
    }

    const spliceddata = data.splice(-4000);
    const datetimegroups = {};
    const datekeys = [];

    spliceddata.forEach(spl => {
        const datekey = getDateString(spl.datetime);
        const timekey = getTimeString(spl.datetime);
        const price = spl.price
        const datetime = spl.datetime;

        if (!datetimegroups[datekey]) {
            datetimegroups[datekey] = [];
        }

        const item = {
            day: datekey,
            time: timekey,
            price,
            datetime
        }

        datetimegroups[datekey].push(item);
        datekeys.push(datekey);
    });

    const uniquedatekeys = [...new Set(datekeys)];
    //console.log(uniquedatekeys);

    const subjectgroupone = getobjectkey(datetimegroups, uniquedatekeys[uniquedatekeys.length - 1]);
    const subjectgrouptwo = getobjectkey(datetimegroups, uniquedatekeys[uniquedatekeys.length - 2]);

    return [...grouphours(subjectgrouptwo), ...grouphours(subjectgroupone)];
}

const pairSchema = new Schema({
    pair: {
        type: String,
        required: true
    },
    baseAsset: {
        type: String,
        required: true,
        index: true // Indexing the baseAsset
    },
    baseAssetId: {
        type: String,
        required: true
    },
    baseAssetType: {
        type: String,
        index: true // Indexing the baseAssetType if needed
    },
    quoteAsset: {
        type: String,
        required: true
    },
    quoteAssetId: {
        type: String,
        required: true
    },
    quoteAssetType: {
        type: String,
        index: true // Indexing the quoteAssetType
    },
    price: {
        type: Number,
        required: true
    },
    pricedifference: {
        type: String,
    },
    orders: {
        type: Array,
        default: []
    },
    listed: {
        type: Boolean,
        default: false
    },
    pricehistory: [],
    inview: {
        type: Boolean,
        required: true,
        default: false
    },
});

pairSchema.methods.calculatePrice = async function () {
    try {
        const baseAsset = await Asset.findById(this.baseAssetId);
        const quoteAsset = await Asset.findById(this.quoteAssetId);

        if (!baseAsset || !quoteAsset) {
            throw new Error('Assets not found');
        }

        //console.log((baseAsset.price / quoteAsset.price), baseAsset.price, quoteAsset.price, this.pair)

        return parseNumber(baseAsset.price) / parseNumber(quoteAsset.price);
    } catch (error) {
        console.error('Error calculating price:', error.message);
        return null;
    }
};

pairSchema.methods.calculatepricedifference = async function () {
    try {
        const baseAsset = await Asset.findById(this.baseAssetId);
        const quoteAsset = await Asset.findById(this.quoteAssetId);

        if (!baseAsset || !quoteAsset) {
            throw new Error('Assets not found');
        }

        const baseassetlatestpricehistory = baseAsset.pricehistory[0];
        const quoteassetlatestpricehistory = quoteAsset.pricehistory[0];

        const baseassetlastpricehistory = baseAsset.pricehistory[5];
        const quoteassetlastpricehistory = quoteAsset.pricehistory[5];

        if (this.baseAssetType === 'commodity') {
            //console.log(this, 'check here');
            return this.pricedifference;
        }

        if (baseassetlatestpricehistory && quoteassetlatestpricehistory && baseassetlastpricehistory && quoteassetlastpricehistory) {
            const priceone = baseassetlatestpricehistory.price / quoteassetlatestpricehistory.price;
            const pricetwo = baseassetlastpricehistory.price / quoteassetlastpricehistory.price;

            return calculatePercentageChange(priceone, pricetwo)
        } else {
            //console.log('check here')
            return 0
        }

    } catch (error) {
        console.error('Error calculating price:', error.message, this.pair);
        return null;
    }
}

pairSchema.methods.gendumborders = async function () {
    const getRandomValue = () => Math.random() < 0.5 ? parseFloat((Math.random() * 0.009 + 0.001).toFixed(4)) : parseFloat((Math.random() * 7 + 1).toFixed(4));
    let ordersresult = []

    try {
        const orders = await Promise.all(
            Array.from({ length: 80 }, async (_, i) => {
                const calculateprice = await this.calculatePrice();
                const price = getRandomPrice(calculateprice, 1); // Ensure getRandomPrice function is defined
                const amount = getRandomValue();
                const total = amount * price;

                // Set 'side' based on whether 'i' is even or odd
                const side = i % 2 === 0 ? 'buy' : 'sell';

                const dumborder = { price, amount, total, side };
                return dumborder;
            })
        );

        ordersresult = orders

        const pairitem = await Pair.findOne({ _id: this._id });

        if (pairitem) {
            pairitem.orders = ordersresult;

            await pairitem.save();
        }

    } catch (error) {
        console.error(error);
    }
};

pairSchema.methods.getpricehistory = async function () {
    try {
        const baseAsset = await Asset.findById(this.baseAssetId);
        const quoteAsset = await Asset.findById(this.quoteAssetId);

        const baseAssetPriceHistory = await PriceHistory.find({ asset: baseAsset._id });
        const quoteAssetPriceHistory = await PriceHistory.find({ asset: quoteAsset._id });

        const baseAssetPriceHistoryMap = new Map();

        baseAssetPriceHistory.forEach(item => {
            baseAssetPriceHistoryMap.set(item.datetime, item);
        });

        const combinedPriceHistory = [];

        quoteAssetPriceHistory.forEach(item => {
            if (baseAssetPriceHistoryMap.has(item.datetime)) {
                const data = {
                    datetime: item.datetime,
                    baseAssetData: baseAssetPriceHistoryMap.get(item.datetime),
                    quoteAssetData: item,
                    price: baseAssetPriceHistoryMap.get(item.datetime).price / item.price
                }

                combinedPriceHistory.push(data);
            }
        });

        return combinedPriceHistory;
    } catch (error) {
        console.error(error);
    }
}

pairSchema.methods.getpricehistorycandlestick = async function () {
    try {
        const baseAsset = await Asset.findById(this.baseAssetId);
        const quoteAsset = await Asset.findById(this.quoteAssetId);

        const baseAssetPriceHistory = await PriceHistory.find({ asset: baseAsset._id });
        const quoteAssetPriceHistory = await PriceHistory.find({ asset: quoteAsset._id });

        const baseAssetPriceHistoryMap = new Map();

        baseAssetPriceHistory.forEach(item => {
            baseAssetPriceHistoryMap.set(item.datetime, item);
        });

        const combinedPriceHistory = [];

        quoteAssetPriceHistory.forEach(item => {
            if (baseAssetPriceHistoryMap.has(item.datetime)) {
                const data = {
                    datetime: item.datetime,
                    baseAssetData: baseAssetPriceHistoryMap.get(item.datetime),
                    quoteAssetData: item,
                    price: baseAssetPriceHistoryMap.get(item.datetime).price / item.price
                }

                combinedPriceHistory.push(data);
            }
        });

        return calculateOHLC(combinedPriceHistory);
    } catch (error) {
        console.error(error);
    }
}

pairSchema.methods.getpricehistorycandlestickMins = async function () {
    try {
        const baseAsset = await Asset.findById(this.baseAssetId);
        const quoteAsset = await Asset.findById(this.quoteAssetId);

        const baseAssetPriceHistory = await PriceHistory.find({ asset: baseAsset._id });
        const quoteAssetPriceHistory = await PriceHistory.find({ asset: quoteAsset._id });

        const baseAssetPriceHistoryMap = new Map();

        baseAssetPriceHistory.forEach(item => {
            baseAssetPriceHistoryMap.set(item.datetime, item);
        });

        const combinedPriceHistory = [];

        quoteAssetPriceHistory.forEach(item => {
            if (baseAssetPriceHistoryMap.has(item.datetime)) {
                const data = {
                    datetime: item.datetime,
                    baseAssetData: baseAssetPriceHistoryMap.get(item.datetime),
                    quoteAssetData: item,
                    price: baseAssetPriceHistoryMap.get(item.datetime).price / item.price
                }

                combinedPriceHistory.push(data);
            }
        });

        return calculateOHLCMinute(combinedPriceHistory);
    } catch (error) {
        console.error(error);
    }
}

const Pair = mongoose.model('Pair', pairSchema);

module.exports = Pair;