"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var withdrawalReqSchema = new _mongoose["default"].Schema({
  userid: {
    type: String,
    required: true
  },
  assetid: {
    type: String,
    required: true
  },
  walletid: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  amountusd: {
    type: String,
    required: true
  },
  bank: {
    type: String,
    "default": "none specified"
  },
  account: {
    type: String,
    "default": ""
  },
  cryptoaddress: {
    type: String,
    "default": ""
  },
  paypalemail: {
    type: String,
    "default": ""
  }
});
var withdrawalReq = _mongoose["default"].model('withdrawalReq', withdrawalReqSchema);
module.exports = withdrawalReq;