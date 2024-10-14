"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var assetBalanceSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true // Adding an index for faster queries on ownerId
  },
  assetId: {
    type: String,
    required: true,
    index: true // Adding an index for faster queries on assetId
  },
  balanceAmount: {
    type: Number,
    required: true,
    min: 0 // Ensuring the balanceAmount is non-negative
  },
  swapOrConvertFrom: {
    type: String,
    required: true,
    "default": "none" // Defaulting to "none" if not provided
  },
  swapOrConvertTo: {
    type: String,
    required: true,
    "default": "none" // Defaulting to "none" if not provided
  },
  assetInteractedWith: {
    type: String,
    "default": "none" // Defaulting to "none" if not provided
  },
  assetType: {
    type: String,
    required: true,
    "enum": ["crypto", "stock", "fiat", "other", "tokenized stock"] // Adding an enum to restrict possible values
  },
  transactionType: {
    type: {
      type: String,
      required: true,
      "enum": ["deposit", "withdrawal", "transfer", "conversion", "autotrade creation", "other"]
    },
    fee: {
      type: Number,
      min: 0 // Ensuring the fee is non-negative
    },
    fromWallet: {
      type: String,
      "default": "none",
      // Defaulting to none if not provided
      "enum": ["fiat/spot", "margin", "defi", "tokenized stocks", "bot trading", "bonus", "none"]
    },
    toWallet: {
      type: String,
      "default": "none",
      // Defaulting to an empty string if not provided
      "enum": ["fiat/spot", "margin", "defi", "tokenized stocks", "bot trading", "bonus", "none"]
    },
    fromAsset: {
      type: String,
      "default": "" // if conversion or swap Defaulting to an empty string if not provided
    },
    toAsset: {
      type: String,
      "default": "" // if conversion or swap Defaulting to an empty string if not provided
    },
    balanceAmountOftoAsset: {
      type: Number,
      min: 0 // Ensuring the fee is non-negative
    }
  },
  transactionDescription: {
    type: String,
    required: true
  },
  currentWallet: {
    type: String,
    required: true,
    "default": "fiat/spot"
  },
  formerWallet: {
    type: String,
    required: true,
    "default": "none"
  },
  cryptoAddressInteractedWith: {
    type: String
  },
  cryptoAddressNetwork: {
    type: String
  },
  date: {
    type: Date,
    "default": Date.now
  }
});

// Adding a compound index on ownerId and assetId for faster lookups
assetBalanceSchema.index({
  ownerId: 1,
  assetId: 1
});
var AssetBalance = mongoose.model('AssetBalance', assetBalanceSchema);
module.exports = AssetBalance;