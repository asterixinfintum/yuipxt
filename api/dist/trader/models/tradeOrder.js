"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tradeOrderSchema = new Schema({
  wallet: {
    type: String,
    required: true
  },
  tradepair: {
    type: String,
    required: true
  },
  ordertype: {
    type: String,
    required: true
  },
  profit: {
    type: Number,
    "default": 0
  },
  loss: {
    type: Number,
    "default": 0
  },
  user: {
    type: String,
    required: true
  },
  state: {
    type: String,
    "default": 'open'
  },
  filled: {
    type: Number,
    "default": 0.005
  },
  active: {
    type: Boolean,
    "default": true
  },
  orderdetails: {
    type: Object,
    "default": {}
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
var TradeOrder = mongoose.model('TradeOrder', tradeOrderSchema);
module.exports = TradeOrder;