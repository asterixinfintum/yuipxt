import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    wallet: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    asset: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    transactionid: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const transactionmodel = mongoose.model('transactionmodel', transactionSchema);

module.exports = transactionmodel;