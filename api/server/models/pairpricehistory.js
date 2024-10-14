const mongoose = require('mongoose');
const { Schema } = mongoose;

const pairpricehistorySchema = new Schema({
    pair: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    datetime: {
        type: String,
        required: true
    },
});

const PairPriceHistory = mongoose.model('PairPriceHistory', pairpricehistorySchema);

module.exports = PairPriceHistory;