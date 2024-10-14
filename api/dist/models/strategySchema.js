"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var strategySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  type: String,
  subtype: String,
  parameters: Schema.Types.Mixed,
  backtestResults: {
    profitLoss: Number,
    maxDrawdown: Number,
    winRate: Number
    // Add more as needed
  },
  closed: {
    type: Boolean,
    "default": false
  },
  profit: {
    type: Number,
    "default": 0
  },
  loss: {
    type: Number,
    "default": 0
  },
  capital: {
    type: Number,
    "default": 0
  }
});
var Strategy = mongoose.model('Strategy', strategySchema);
module.exports = Strategy;