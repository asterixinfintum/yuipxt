"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pairpricehistorySchema = new Schema({
  pair: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  datetime: {
    type: String,
    required: true
  }
});
var PairPriceHistory = mongoose.model('PairPriceHistory', pairpricehistorySchema);
module.exports = PairPriceHistory;