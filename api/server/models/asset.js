const mongoose = require('mongoose');
const { Schema } = mongoose;

import PriceHistory from './pricehistory';

function formatDateToString(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const assetSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        default: '',
    },
    coin: {
        type: String,
        required: true,
        index: true,
        default: '',
    },
    symbol: {
        type: String,
        required: true,
        index: true,
        default: '',
    },
    assetType: {
        type: String,
        required: true,
        index: true,
        default: '',
    },
    price: {
        type: String,
        required: true,
        index: true,
        default: '',
    },
    image: {
        type: String,
        required: true,
        index: true,
    },
    pricehistory: {
        type: Array,
        default: []
    },
    faileddatafetch: {
        type: Boolean,
        default: false
    },
    pricechange: {
        type: String,
    },
    listed: {
        type: Boolean,
        default: true
    }
});

assetSchema.methods.gettwentyfourhrhigh = async function (_id) {
    const date24HoursAgo = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    const dateString24HoursAgo = date24HoursAgo.toISOString().slice(0, 16).replace('T', ' ');

    const highestEntry = await PriceHistory.findOne({ asset: this._id, datetime: { $gte: dateString24HoursAgo } }).sort({ price: -1 });

    if (highestEntry) {
        return highestEntry
    }

    return null;
}

assetSchema.methods.gettwentyfourhrlow = async function (_id) {
    const date24HoursAgo = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    const dateString24HoursAgo = date24HoursAgo.toISOString().slice(0, 16).replace('T', ' ');

    const lowestEntry = await PriceHistory.findOne({ asset: this._id, datetime: { $gte: dateString24HoursAgo } }).sort({ price: 1 });

    if (lowestEntry) {
        return lowestEntry;
    }

    return null;
}

assetSchema.methods.gettwentyfourhrchange = async function () {
    const latestEntry = await PriceHistory.findOne({ asset: this._id }).sort({ datetime: -1 });

    if (!latestEntry) {
        return null
    }

    const latestEntryDate = new Date(latestEntry.datetime)

    const date24HoursAgo = new Date(latestEntryDate.getTime() - (24 * 60 * 60 * 1000));

    const entry24HoursAgo = await PriceHistory.findOne({ asset: this._id, datetime: formatDateToString(date24HoursAgo) });

    if (entry24HoursAgo) {
        const percentageChange = ((latestEntry.price - entry24HoursAgo.price) / entry24HoursAgo.price) * 100;
        return percentageChange;
    }

    return null;
}

const Asset = mongoose.model('asset', assetSchema);

module.exports = Asset;