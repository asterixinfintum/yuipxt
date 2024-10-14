"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var stockAssetsDBSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  coin: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  symbol: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  price: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  time: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  ts: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  dailyChange: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  low: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  high: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  previousPrice: {
    type: String,
    required: true,
    "default": 'none'
  },
  priceChanges: [{
    pricechange: {
      type: Number,
      required: true
    },
    updated: {
      type: Date,
      required: true,
      "default": Date.now
    }
  }]
});
var stockAssetsDB = mongoose.model('stockAssetsDB', stockAssetsDBSchema);
module.exports = stockAssetsDB;