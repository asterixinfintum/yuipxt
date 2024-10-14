import fetch from 'node-fetch';

import Wllt from '../models/wllt';

async function getBitcoinBalances() {
    let tracker = 0;
    let timerId;

    try {
        const wallets = await Wllt.find();

        if (wallets.length) {
            const walletBatches = splitArray(wallets);

            const iterateOverWalletBatches = async () => {

                await callNode(walletBatches[tracker]);
                tracker += 1;

                if (tracker === walletBatches.length) {
                    callClearInterval();
                }
            };

            timerId = setInterval(iterateOverWalletBatches, 5000);

            function callClearInterval() {
                clearInterval(timerId);
            }
        }

    } catch (error) {
        console.log(error)
    }
}

function splitArray(arr) {
    const chunkSize = 10;
    const chunks = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
        chunks.push(arr.slice(i, i + chunkSize));
    }

    return chunks;
}

async function callNode(walletBatch) {
    walletBatch.forEach(async (wallt) => {
        const { bitcoinAddress, confirmedBitcoinTransactions, _id } = wallt

        const base_url = `${process.env.BITNODE}/${process.env.BITNODEK}`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "method": "bb_getaddress",
                "params": [
                    `${bitcoinAddress}`,
                    {
                        "page": 1,
                        "size": 1000,
                        "fromHeight": 0,
                        "details": "txids"
                    }
                ]
            })
        }

        await fetch(base_url, options)
            .then(response => response.json())
            .then(async (responsedata) => {
                const { result } = responsedata;

                if (result.txids && result.txids.length) {
                    let newtxids = [];
                    const txids = result.txids

                    await txids.forEach(txid => {
                        if (!confirmedBitcoinTransactions.includes(txid)) {
                            newtxids.push(txid)
                        }
                    });

                    if (newtxids.length) {
                        newtxids.forEach(newtxid => {
                            fetch(base_url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    method: "getrawtransaction",
                                    params: [
                                        `${newtxid}`,
                                        2
                                    ]
                                })
                            })
                                .then(response => response.json())
                                .then((txiddata) => {
                                    const { confirmations, vout } = txiddata.result;

                                    if (confirmations >= 6) {
                                        const { value } = vout[0];

                                        Wllt.updateBTCTransactions(bitcoinAddress, newtxid, value);
                                    }
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                        })
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });
    });
}

export default getBitcoinBalances;