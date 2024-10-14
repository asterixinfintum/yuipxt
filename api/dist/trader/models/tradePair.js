"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tradePairSchema = new Schema({
  pair: {
    type: String,
    required: true
  },
  baseAsset: {
    type: String,
    required: true,
    index: true // Indexing the baseAsset
  },
  baseAssetId: {
    type: String,
    required: true
  },
  baseAssetType: {
    type: String,
    index: true // Indexing the baseAssetType if needed
  },
  quoteAsset: {
    type: String,
    required: true
  },
  quoteAssetId: {
    type: String,
    required: true
  },
  quoteAssetType: {
    type: String,
    index: true // Indexing the quoteAssetType
  },
  listed: {
    type: Boolean,
    "default": false
  }
});
var TradePair = mongoose.model('TradeOrder', tradePairSchema);
module.exports = TradePair;