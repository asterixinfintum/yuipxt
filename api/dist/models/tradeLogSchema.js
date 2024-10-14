"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tradeLogSchema = new Schema({
  botId: {
    type: Schema.Types.ObjectId,
    ref: 'TradingBot',
    required: true
  },
  // Reference to the TradingBot model
  timestamp: {
    type: Date,
    "default": Date.now
  },
  assetPair: String,
  // e.g., BTC/USD
  action: String,
  // e.g., "BUY" or "SELL"
  price: Number,
  quantity: Number,
  totalValue: Number,
  fees: Number,
  notes: String
});
var TradeLog = mongoose.model('TradeLog', tradeLogSchema);
module.exports = {
  TradeLog: TradeLog
};