const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autoTradeSchema = new Schema({
    tradingPair: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    assettobuy: {
        type: String,
        required: true
    },
    assettosell: {
        type: String,
        required: true
    },
    assettobuytype: {
        type: String,
        enum: ['crypto', 'stock', 'commodity', 'fiat'],
        required: true
    },
    assettoselltype: {
        type: String,
        enum: ['crypto', 'stock', 'commodity', 'fiat'],
        required: true
    },
    wallet: {
        type: String,
        required: true
    },
    wallettype: {
        type: String,
        required: true
    },
    fees: { type: Number, default: 0 },
    initialusddeposit: {
        type: Number
    },
    usdbalance: {
        type: Number,
        default: null
    },
    quantity: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    orders: [],
    autotradestrategies: [],
    tradeStatus: {
        type: String,
        required: true,
        default: 'profit',
        enum: ['profit', 'loss']
    },
    status: {
        type: String,
        enum: ['running', 'canceled'],
        required: true,
        default: 'running'
    },
});

autoTradeSchema.methods.cancel = async function () {
    this.status = 'canceled';
    this.save();
}

autoTradeSchema.statics.recordbuy = async function () {

}

autoTradeSchema.statics.recordsell = async function () {

}

const AutoTrade = mongoose.model('Autotrade', autoTradeSchema);

module.exports = AutoTrade;