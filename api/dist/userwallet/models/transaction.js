"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var transactionSchema = new _mongoose["default"].Schema({
  userid: {
    type: String,
    required: true
  },
  wallet: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  asset: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  transactionid: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
var transactionmodel = _mongoose["default"].model('transactionmodel', transactionSchema);
module.exports = transactionmodel;