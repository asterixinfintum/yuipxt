const mongoose = require('mongoose');
const { Schema } = mongoose;

const ctdschema = new Schema({
    symbol: {
        type: String
    },
    currency_base: {
        type: String
    },
    currency_quote: {
        type: String
    },
    exchange: {
        type: String
    },
    assetid: {
        type: String
    },
    values: [],
    assettype: {
        type: String
    }
});

const CTD = mongoose.model('CryptoTradeData', ctdschema);

module.exports = CTD;