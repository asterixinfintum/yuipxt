const mongoose = require('mongoose');
const { Schema } = mongoose;

const cryptoAssetSchema = new Schema({
    data: Schema.Types.Mixed,
    previousPrice: {
        type: String,
        required: true,
        default: 'none'
    },
    createdAt: { type: Date, default: Date.now }
});

const CryptoAsset = mongoose.model('CryptoAsset', cryptoAssetSchema);

module.exports = CryptoAsset;
