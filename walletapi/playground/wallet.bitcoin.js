const { PrivateKey } = require("bitcore-lib");

const { mainnet } = require("bitcore-lib/lib/networks");
const Mnemonic = require("bitcore-mnemonic");
const bitcore = require('bitcore-lib'); 
const bitcoin = require('bitcoinjs-lib');
const bip32 = require('bip32'); 

const createWallet = (network = mainnet) => {
    const privateKey = new PrivateKey();
    const address = privateKey.toAddress(network);

    return {
        privateKey: privateKey.toString(),
        address: address.toString()
    }
}

const createHDWallet = (network = "mainet") => {
    let passPhrase = new Mnemonic(Mnemonic.Words.ENGLISH);
    let xpriv = passPhrase.toHDPrivateKey(passPhrase.toString(), network);

    return {
        xpub: xpriv.xpubkey,
        privateKey: xpriv.privateKey.toString(),
        address: xpriv.publicKey.toAddress().toString(),
        mnemonic: passPhrase.toString()
    };
}

/*{
  xpub: 'xpub661MyMwAqRbcGPu7fsoR9ZaL6Jr7EVTjrTTcXVVsmfZRJTDhZzy7fT7kY9fXuvk6ybwkVsYvEf2HAn9sDygEhrwUKFCspPU6piB4kdsBkx4',
  privateKey: '458254442e4c827e0151f8d3ea8eb10ece38ad383d044e460dbfb05ff103313a',
  address: '12a2txnk9ZUsHUAo1vrDvYfoZ9WQAYtYXr',
  mnemonic: 'jar evolve spread art robust post general length shrug like try strike'
}*/

console.log(createHDWallet())