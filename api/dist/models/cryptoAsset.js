"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var cryptoAssetSchema = new Schema({
  data: Schema.Types.Mixed,
  previousPrice: {
    type: String,
    required: true,
    "default": 'none'
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
var CryptoAsset = mongoose.model('CryptoAsset', cryptoAssetSchema);
module.exports = CryptoAsset;