import mongoose from 'mongoose';

import Asset from '../../models/asset';

const { Schema } = mongoose;

const userWalletSchema = new Schema({
    owner: {
        type: String,
        required: true,
    },
    wallettype: {
        type: String,
        required: true,
    },
    balances: {
        type: Array,
        default: [] //asset ids and balances [{ assetid, balance }]
    },
    bitcoinaddress: {
        type: String,
        default: ''
    }
});

userWalletSchema.methods.returnBalance = async function ({ assetType, start, end, searchquery }) {
    const wallet_blcs = this.balances.filter(blc => blc && blc.asset_id);

    const btcAsset = await Asset.findOne({ name: "Bitcoin" });
    let assets;

    if (assetType) {
        assets = await Asset.find({ assetType });
    } else {
        assets = await Asset.find();
    }

    const balances = [];
    const assetinbalance = wallet_blcs.map(blc => blc.asset_id.toString());

    await Promise.all(wallet_blcs.map(async (blc) => {
        const asset = await Asset.findOne({ _id: blc.asset_id });
        const asset_price = parseNumber(asset.price);
        const btcprice = btcAsset.price;
        const wallet_assetblc = blc.balance;
        const usdblc = wallet_assetblc * asset_price;
        const btcblc = usdblc / btcprice;

        const blcs = {
            assetid: asset._id,
            assetname: asset.name,
            assettype: asset.assetType,
            assetinitials: asset.coin,
            assetlogo: asset.image,
            assetprice: asset_price,
            usdblc,
            btcblc,
            blc: wallet_assetblc,
        };

        balances.push(blcs);
    }));

    const usdtotal = balances.reduce((accumulator, balance) => accumulator + balance.usdblc, 0);
    const btctotal = balances.reduce((accumulator, balance) => accumulator + balance.btcblc, 0);

    const notowned = assets.filter(asset => !assetinbalance.includes(asset._id.toString()));
    let ownedlist;
    let notownedlist = notowned.map(notownedasset => {
        return {
            assetid: notownedasset._id,
            assetname: notownedasset.name,
            assettype: notownedasset.assetType,
            assetinitials: notownedasset.coin,
            assetlogo: notownedasset.image,
            assetprice: notownedasset.price,
            usdblc: 0,
            btcblc: 0,
            blc: 0,
        }
    })

    if (assetType) {
        ownedlist = balances.filter(blc => blc.assettype === assetType);
    } else {
        ownedlist = balances
    }

    const walletassets_list = [...ownedlist, ...notownedlist]

    if (start !== undefined && end !== undefined) {
        if (searchquery !== undefined) {
            const normalizedSearchQuery = searchquery.trim().toLowerCase();
            const filt = walletassets_list.filter(itm =>
                itm.assetname.trim().toLowerCase().includes(normalizedSearchQuery)
            );

            return { walletassets_list: filt.slice(start, end), usdtotal, btctotal, total: filt.length };
        } else {
            return { walletassets_list: walletassets_list.slice(start, end), usdtotal, btctotal, total: walletassets_list.length };
        }
    } else {
        return { walletassets_list, usdtotal, btctotal };
    }
};

userWalletSchema.statics.returnDashboardBalances = async function (owner) {
    const userwallets = await this.find({ owner });
    let marginwallet;
    let spotwallet;

    await Promise.all(userwallets.map(async (userwallet) => {
        const wallet_blcs = userwallet.balances;
        const btcAsset = await Asset.findOne({ name: "Bitcoin" });

        if (wallet_blcs.length) {
            const balances = [];

            for (const blc of wallet_blcs) {
                const asset = await Asset.findOne({ _id: blc.asset_id });
                const asset_price = parseNumber(asset.price);
                const btcprice = btcAsset.price;
                const wallet_assetblc = blc.balance;
                const usdblc = wallet_assetblc * asset_price;
                const btcblc = usdblc / btcprice;

                const dashboardtotals = {
                    usdblc,
                    btcblc,
                }

                balances.push(dashboardtotals);
            }

            const usdtotal = balances.reduce((accumulator, balance) => accumulator + balance.usdblc, 0);
            const btctotal = balances.reduce((accumulator, balance) => accumulator + balance.btcblc, 0);

            if (userwallet.wallettype === 'spot') {
                spotwallet = {
                    usdtotal,
                    btctotal
                }
            } else {
                marginwallet = {
                    usdtotal,
                    btctotal
                }
            }
        } else {
            if (userwallet.wallettype === 'spot') {
                spotwallet = {
                    usdtotal: 0,
                    btctotal: 0
                }
            } else {
                marginwallet = {
                    usdtotal: 0,
                    btctotal: 0
                }
            }
        }
    }));

    return { spotwallet, marginwallet }
}

const UserWallet = mongoose.model('UserWallet', userWalletSchema);

export default UserWallet;

function parseNumber(str) {
    // Remove commas from the string
    const stringWithoutCommas = str.replace(/,/g, '');

    // Parse the string as a float
    const numericValue = parseFloat(stringWithoutCommas);

    return numericValue;
}