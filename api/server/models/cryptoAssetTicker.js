const mongoose = require('mongoose');
const { Schema } = mongoose;

const cryptoAssetTickerSchema = new Schema({
    data: Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now }
});

const CryptoAssetTicker = mongoose.model('CryptoAssetTicker', cryptoAssetTickerSchema);

module.exports = CryptoAssetTicker;