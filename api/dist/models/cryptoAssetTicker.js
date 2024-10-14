"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var cryptoAssetTickerSchema = new Schema({
  data: Schema.Types.Mixed,
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
var CryptoAssetTicker = mongoose.model('CryptoAssetTicker', cryptoAssetTickerSchema);
module.exports = CryptoAssetTicker;