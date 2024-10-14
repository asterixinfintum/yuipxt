"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var allowedPairSchema = new Schema({
  type: {
    type: String,
    required: true,
    "enum": ['crypto', 'stock', 'commodity']
  },
  pairlabel: {
    type: String,
    required: true
  },
  pair: {
    type: String,
    required: true
  }
});
var AllowedPair = mongoose.model('AllowedPair', allowedPairSchema);
module.exports = AllowedPair;