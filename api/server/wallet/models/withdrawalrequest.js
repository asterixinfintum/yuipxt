const mongoose = require('mongoose');

const withdrawalRequestSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    asset: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    usdamount: {
        type: Number,
        required: true
    },
    Bank: {
        type: String,
        required: true
    },
    Account: {
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
    }
});

const WithdrawalRequest = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);

module.exports = WithdrawalRequest;
