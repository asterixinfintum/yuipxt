"use strict";

var _require = require("bitcore-lib"),
  PrivateKey = _require.PrivateKey;
var _require2 = require("bitcore-lib/lib/networks"),
  mainnet = _require2.mainnet,
  testnet = _require2.testnet;
var Mnemonic = require("bitcore-mnemonic");
var createWallet = function createWallet() {
  var network = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mainnet;
  var privateKey = new PrivateKey();
  var address = privateKey.toAddress(network);
  return {
    privateKey: privateKey.toString(),
    address: address.toString()
  };
};

/**
A Hierarchical Deterministic (HD) wallet is the term used to describe a wallet which uses a seed to derive public and private keys
**/

var createHDWallet = function createHDWallet() {
  var network = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mainnet;
  var passPhrase = new Mnemonic(Mnemonic.Words.ENGLISH);
  var xpriv = passPhrase.toHDPrivateKey(passPhrase.toString(), network);
  return {
    xpub: xpriv.xpubkey,
    privateKey: xpriv.privateKey.toString(),
    address: xpriv.publicKey.toAddress().toString(),
    mnemonic: passPhrase.toString()
  };
};
module.exports = {
  createHDWallet: createHDWallet,
  createWallet: createWallet
};