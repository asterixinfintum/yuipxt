"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var cryptoAssetPriceSchema = new Schema({
  data: Schema.Types.Mixed,
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
var CryptoAssetPrice = mongoose.model('CryptoAssetPrice', cryptoAssetPriceSchema);
module.exports = CryptoAssetPrice;