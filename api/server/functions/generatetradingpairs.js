import Asset from '../models/asset';
import Pair from '../models/pair';

async function generatetradingpairs() {
    const assets = await Asset.find();

    const pairs = [];

    for (let i = 0; i < assets.length; i++) {
        for (let j = i + 1; j < assets.length; j++) {
            const pair1 = {
                baseAssetId: assets[i]._id,
                baseAsset: assets[i].symbol,
                quoteAsset: assets[j].symbol,
                quoteAssetId: assets[j]._id,
                baseAssetType: assets[i].assetType,
                quoteAssetType: assets[j].assetType,
                pair: `${assets[i].symbol}/${assets[j].symbol}`,
                price: parseFloat(assets[i].price) / parseFloat(assets[j].price)
            };
            const pair2 = {
                baseAssetId: assets[j]._id,
                baseAsset: assets[j].symbol,
                quoteAsset: assets[i].symbol,
                quoteAssetId: assets[i]._id,
                baseAssetType: assets[j].assetType,
                quoteAssetType: assets[i].assetType,
                pair: `${assets[j].symbol}/${assets[i].symbol}`,
                price: parseFloat(assets[j].price) / parseFloat(assets[i].price)
            };
            pairs.push(pair1, pair2);
        }
    }

    for (const pair of pairs) {
        try {
            const existingPair = await Pair.findOne({ pair: pair.pair });

            if (!existingPair) {
                const newPair = new Pair(pair);
                await newPair.save();

                console.log(newPair.pair);
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default generatetradingpairs