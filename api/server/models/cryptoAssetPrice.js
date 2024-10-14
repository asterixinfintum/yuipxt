const mongoose = require('mongoose');
const { Schema } = mongoose;

const cryptoAssetPriceSchema = new Schema({
    data: Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now }
});

const CryptoAssetPrice = mongoose.model('CryptoAssetPrice', cryptoAssetPriceSchema);

module.exports = CryptoAssetPrice;