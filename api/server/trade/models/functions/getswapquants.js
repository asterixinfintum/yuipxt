import Asset from '../../../models/asset';

async function getswapquants({ assetOne, assetTwo, quantAssetTwo }) {
    const oneAsset = await Asset.findOne({ _id: assetOne });
    const twoAsset = await Asset.findOne({ _id: assetTwo });
    const quantToUSD = (parseFloat(quantAssetTwo) * parseFloat(twoAsset.price))
    const quantAssetOne = (quantToUSD / parseFloat(oneAsset.price));

    return {
        asstOne: {
            id: assetOne,
            name: oneAsset.name,
            quantity: quantAssetOne
        },
        asstTwo: {
            id: assetTwo,
            name: twoAsset.name,
            quantity: quantAssetTwo
        },
    }
}

export default getswapquants;