"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var executedTradeSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  tradingPair: {
    type: String,
    required: true
  },
  assetId: {
    type: String,
    required: true
  },
  assetType: {
    type: String,
    "enum": ['crypto', 'stock', 'commodity'],
    required: true
  },
  side: {
    type: String,
    "enum": ['buy', 'sell'],
    required: true
  },
  executionPrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  orderAmount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    "default": Date.now
  }
});
var ExecutedTrade = mongoose.model('ExecutedTrade', executedTradeSchema);
module.exports = ExecutedTrade;