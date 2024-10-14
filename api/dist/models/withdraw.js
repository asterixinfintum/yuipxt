"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var withdrawSchema = new Schema({
  ownerId: {
    type: String,
    required: true
  },
  assetId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  }
});
var Withdraw = mongoose.model('Withdraw', withdrawSchema);
module.exports = Withdraw;