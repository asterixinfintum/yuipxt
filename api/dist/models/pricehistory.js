"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pricehistorySchema = new Schema({
  asset: {
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
var PriceHistory = mongoose.model('PriceHistory', pricehistorySchema);
module.exports = PriceHistory;