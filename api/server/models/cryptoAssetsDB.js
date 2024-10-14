const mongoose = require('mongoose');
const { Schema } = mongoose;

const cryptoAssetsDBSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
    default: '',
  },
  coin: {
    type: String,
    required: true,
    index: true,
    default: '',
  },
  symbol: {
    type: String,
    required: true,
    index: true,
    default: '',
  },
  price: {
    type: String,
    required: true,
    index: true,
    default: '',
  },
  displayName: {
    type: String,
    required: true,
    index: true,
    default: '',
  },
  previousPrice: {
    type: String,
    required: true,
    default: 'none'
  },
  priceChanges: [{
    pricechange: {
      type: Number,
      required: true
    },
    updated: {
      type: Date,
      required: true,
      default: Date.now,
    }
  }]
});

const CryptoAssetsDB = mongoose.model('CryptoAssetsDB', cryptoAssetsDBSchema);

module.exports = CryptoAssetsDB;