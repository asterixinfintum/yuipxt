const mongoose = require('mongoose');
const { Schema } = mongoose;

const tradeOrderSchema = new Schema({
    wallet: {
        type: String,
        required: true
    },
    tradepair: {
        type: String,
        required: true
    },
    ordertype: {
        type: String,
        required: true
    },
    profit: {
        type: Number,
        default: 0
    },
    loss: {
        type: Number,
        default: 0
    },
    user: {
        type: String,
        required: true
    },
    state: {
        type: String,
        default: 'open'
    },
    filled: {
        type: Number,
        default: 0.005
    },
    active: {
        type: Boolean,
        default: true
    },
    orderdetails: {
        type: Object,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TradeOrder = mongoose.model('TradeOrder', tradeOrderSchema);

module.exports = TradeOrder;