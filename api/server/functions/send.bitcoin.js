// sending bitcoin
//const axios = require("axios");
import fetch from 'node-fetch'
const bitcore = require("bitcore-lib");
const TESTNET = true

function validateNumber(str) {
  let num = parseFloat(str);
  return !isNaN(num) ? num : null;
}

const sendBitcoin = async (recieverAddress, amountToSend) => {
  try {
    const privateKey = "ce9bdd5ea616443880e2fe6606117c39f744464adeec402291c35873b2c84be0"//"7cd8eae2baf697154f8192838d27a75f46fd34fa0f37a456e71caa1b0fec589b";
    const sourceAddress = "mnpkMeTo9oausWwPJzY6WrGysJk2JwSe8i";//"n1NFCn1pUyPu1fttNJqgA2t39K96ZqXvbk";
    const satoshiToSend = amountToSend * 100000000;
    let fee = 0;
    let inputCount = 0;
    let outputCount = 2;

    const baseurl = `https://restless-cool-pond.btc-testnet.quiknode.pro/562dde0076cb35ead30796f1329cfc8430e8a038`;

    const getRecommendedfeeOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method: 'estimatesmartfee',
        params: [10]
      }),
      redirect: 'follow'
    };

    const getUtxoOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method: "bb_getutxos",
        params: [
          `${sourceAddress}`,
          { "confirmed": true }
        ]
      }),
      redirect: 'follow'
    }

    const requestrecommendedFee = await fetch(baseurl, getRecommendedfeeOptions);
    const recommendedFeeResult = await requestrecommendedFee.text();
    const recommendedFee = JSON.parse(recommendedFeeResult).result.feerate;

    const requestutxos = await fetch(baseurl, getUtxoOptions);
    const utxosResult = await requestutxos.text();
    const utxos = JSON.parse(utxosResult).result;
    const transaction = new bitcore.Transaction();

    let totalAmountAvailable = 0;
    let inputs = [];

    for (const utxo of utxos) {
      let input = {};
      input.satoshis = validateNumber(utxo.value);
      input.script = bitcore.Script.buildPublicKeyHashOut(sourceAddress).toHex();
      input.address = sourceAddress;
      input.txId = utxo.txid;
      input.outputIndex = utxo.vout;
      totalAmountAvailable += utxo.value;
      inputCount += 1;
      inputs.push(input);
    };

    const transactionSize = inputCount * 180 + outputCount * 34 + 10 - inputCount;
    fee = transactionSize * recommendedFee / 3; // satoshi per byte

    if (TESTNET) {
      fee = transactionSize * 1 // 1 sat/byte is fine for testnet
    }

    if (totalAmountAvailable - satoshiToSend - fee < 0) {
      throw new Error("Balance is too low for this transaction");
    }

    transaction.from(inputs);

    transaction.to(recieverAddress, satoshiToSend);

    // Set change address - Address to receive the left over funds after transfer
    transaction.change(sourceAddress);

    //manually set transaction fees: 20 satoshis per byte
    transaction.fee(Math.round(fee));

    // Sign transaction with your private key
    transaction.sign(privateKey);

    // serialize Transactions
    const serializedTransaction = transaction.serialize();

    console.log(
      utxos,
      recommendedFee,
      fee,
      JSON.parse(recommendedFeeResult),
      inputs,
      transaction,
      transactionSize,
      serializedTransaction,
      'result here'
    );

    const result = await fetch(baseurl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method: "sendrawtransaction",
        params: [
          serializedTransaction
        ]
      }),
    })
      .then(response => response.json())
      .catch(error => console.error('Error:', error));

    console.log('=========================================================================================')

    console.log(result);
  } catch (error) {
    return error;
  }
}

module.exports = sendBitcoin;