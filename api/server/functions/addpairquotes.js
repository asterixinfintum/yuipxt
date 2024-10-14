import Asset from '../models/asset';
import Pair from '../models/pair';

async function addpairquotes() {
    const pairs = await Pair.find();

    pairs.forEach(async pair => {
        const quoteAsset = await Asset.findOne({ _id: pair.quoteAssetId });
        const baseAsset = await Asset.findOne({ _id: pair.baseAssetId });

        pair.quoteAssetType = quoteAsset.assetType;
        pair.baseAssetType = baseAsset.assetType;

        pair.save();

        console.log(quoteAsset.assetType, baseAsset.assetType)
    });
}

export default addpairquotes;