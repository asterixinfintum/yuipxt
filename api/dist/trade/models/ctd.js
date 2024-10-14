"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ctdschema = new Schema({
  symbol: {
    type: String
  },
  currency_base: {
    type: String
  },
  currency_quote: {
    type: String
  },
  exchange: {
    type: String
  },
  assetid: {
    type: String
  },
  values: [],
  assettype: {
    type: String
  }
});
var CTD = mongoose.model('CryptoTradeData', ctdschema);
module.exports = CTD;