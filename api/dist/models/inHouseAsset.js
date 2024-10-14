"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var inHouseAssetSchema = new Schema({
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
  symbolImg: {
    type: String,
    index: true,
    required: true,
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
    "default": function _default() {
      return new Date().toISOString();
    }
  },
  ts: {
    type: String,
    required: true,
    index: true,
    "default": function _default() {
      return new Date().toISOString();
    }
  },
  dailyChange: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  supportBorrow: {
    type: Boolean,
    required: true,
    "default": true
  },
  assetType: {
    type: String,
    required: true,
    index: true,
    "default": '' //stock, tokenized stock, fiat
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true // Adding an index for faster queries on ownerId
  },
  open: {
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
  close: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  tickerSymbol: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  chain: {
    type: String
  },
  initialPrice: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  marketCap: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  liquidity: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  totalSupply: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  circulatingSupply: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  description: {
    type: String,
    required: true,
    index: true,
    "default": ''
  },
  delisted: {
    type: Boolean,
    required: true,
    "default": false
  },
  editedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin' // assuming you have a User model
  }]
});
var inHouseAsset = mongoose.model('inHouseAsset', inHouseAssetSchema);
module.exports = inHouseAsset;