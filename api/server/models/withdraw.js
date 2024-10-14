const mongoose = require('mongoose');

const { Schema } = mongoose;

const withdrawSchema = new Schema({
    ownerId: {
        type: String,
        required: true
    },
    assetId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

const Withdraw = mongoose.model('Withdraw', withdrawSchema);

module.exports = Withdraw;