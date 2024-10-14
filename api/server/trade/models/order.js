const mongoose = require('mongoose');
const Schema = mongoose.Schema;

import executeorder from './functions/executeorder';
import executesell from './functions/executesell';

const orderSchema = new Schema({
    userId: {
        type: String,
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
    tradingPair: {
        type: String,
        required: true
    },
    pairId: {
        type: String, 
        required: true
    },
    type: {
        type: String,
        enum: ['market', 'limit', 'stop'],
        required: true
    },
    side: {
        type: String,
        enum: ['buy', 'sell'],
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
    partialorderfilling: {
        type: Array,
        default: []  // This will be null until the order is executed, at which point it will be set to the execution price.
    },
    fees: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    assettosell: {
        type: String,
        required: true
    },
    assettobuy: {
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
    limitPrice: {
        type: Number || Boolean,
        required: true,
        default: false
    },
    stopPrice: {
        type: Number || Boolean,
        required: true,
        default: false
    },
    filled: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ['executed', 'canceled', 'pending', 'partially filled', 'fulfilled'],
        required: true,
        default: 'pending'
    },
    margin: {
        type: Number || Boolean,
        required: true,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

orderSchema.methods.cancel = async function () {
    this.status = 'canceled';
    this.save();
}

orderSchema.methods.executeorder = executeorder;
orderSchema.methods.executesell = executesell;

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
