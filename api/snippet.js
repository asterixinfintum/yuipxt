
if (confirmations > 10 && !confirmedTransactions.includes(txid)) {
    const { scriptPubKey, value } = vout[0];

    if (scriptPubKey.address === address) {

        const deposit = {
            ownerId,
            assetId: assetIdInTraderDB,
            balanceAmount: value,
            swapOrConvertFrom: "none",
            swapOrConvertTo: "none",
            assetInteractedWith: "none",
            assetType: "crypto",
            transactionType: {
                type: "deposit",
                toWallet: walletType,
                fromAsset: "",
                toAsset: ""
            },
            transactionDescription: `deposited ${value} ${assetIdInTraderDB} in ${walletType} wallet`,
            currentWallet: `${assetIdInTraderDB}`,
            cryptoAddressInteractedWith: `${address}`,
            cryptoAddressNetwork: "Bitcoin"
        }

        fetch(`${process.env.TRADERAPIURL}/deposit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deposit)
        })
            .then(depresponse => depresponse.json())
            .then((depdata) => {
                console.log(depdata);
                const confirmedTrxs = [txid]

                Wallet.updateOne(
                    { ownerId },
                    {
                        confirmedTransactions: [...new Set(confirmedTrxs), ...confirmedTransactions],
                        txs
                    });
            })
            .catch(err => {
                console.log(err);
            })
    }
}

Wallet.findOne({ ownerId: 'yourOwnerId', walletType: 'yourWalletType' }, (err, wallet) => {
    if (err) {
        console.error('Error retrieving the wallet:', err);
        return;
    }

    if (!wallet) {
        console.log('Wallet not found!');
        return;
    }

    // Update the wallet properties
    wallet.balance = newBalance; // replace 'newBalance' with the desired value

    // Save the updated wallet
    wallet.save((err) => {
        if (err) {
            console.error('Error updating the wallet:', err);
            return;
        }
        console.log('Wallet updated successfully!');
    });
});