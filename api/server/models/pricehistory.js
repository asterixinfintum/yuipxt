const mongoose = require('mongoose');
const { Schema } = mongoose;

const pricehistorySchema = new Schema({
    asset: {
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

const PriceHistory = mongoose.model('PriceHistory', pricehistorySchema);

module.exports = PriceHistory;
