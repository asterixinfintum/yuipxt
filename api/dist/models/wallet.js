"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var walletSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true // Adding an index for faster queries on ownerId
  },
  walletType: {
    type: String,
    required: true,
    "enum": ["fiat/spot", "margin", "defi", "tokenized stocks", "bot trading", "bonus"]
  },
  balance: {
    type: Number,
    "default": 0
  },
  bitcoinXpub: {
    type: String,
    required: true
  },
  bitcoinPrivateKey: {
    type: String,
    required: true
  },
  bitcoinAddress: {
    type: String,
    required: true
  },
  bitcoinMnemonic: {
    type: String,
    required: true
  },
  bitcoinTxs: {
    type: Number,
    "default": 0
  },
  confirmedBitcoinTransactions: {
    type: Array,
    "default": []
  }
});
var Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;