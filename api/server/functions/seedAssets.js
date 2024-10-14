import Asset from '../models/asset';

import stocks from '../utils/stockSymbols';
import crypto from '../utils/cryptoSymbols';
import commodities from '../utils/commoditySymbols';
import fiat from '../utils/fiatSymbols';

async function seedAssets({ assetType, assetId }) {

    if (assetType === 'clear') {
        await deleteAllAssets();
        return;
    }

    if (assetType === 'deleteone' && assetId) {
        Asset.findByIdAndDelete(assetId, (err, deletedAsset) => {
            if (err) {
                console.error('Error:', err);
            } else if (deletedAsset) {
                console.log('Deleted asset:', deletedAsset);
            } else {
                console.log('No asset found with that ID.');
            }
        });
    }

    const existassets = await Asset.find({ assetType });

    if (existassets.length) {
        return;
    } else {
        if (assetType === 'stock') {
            await seed(stocks, assetType);
        }

        if (assetType === 'crypto') {
            await seed(crypto, assetType);
        }

        if (assetType === 'commodity') {
            await seed(commodities, assetType)
        }

        if (assetType === 'fiat') {
            await seed(fiat, assetType)
        }
    }
}

async function seed(assetSymbols, assetType) {
    assetSymbols.forEach(async (assetSymbol) => {
        const { symbol, name, image } = assetSymbol;

        try {

            await createAsset({
                name,
                coin: symbol,
                symbol,
                assetType,
                image,
            });

            console.log('seeded')
        } catch (error) {
            console.log('error:', error, symbol);
        }
    });
}

async function createAsset({ name, coin, symbol, assetType, image }) {
    return new Promise(async (resolve, reject) => {
        try {
            const asset = {
                name,
                coin,
                symbol,
                assetType,
                price: '1',
                image
            }

            const newAsset = new Asset(asset);
            const savedAsset = await newAsset.save();
            resolve(savedAsset);
        } catch (error) {
            console.log('error:', error, symbol);
            reject('error:', error, symbol);
        }
    });
}

async function deleteAllAssets() {
    await Asset.deleteMany({}, { multi: true });
    console.log('deleted all')
}




export default seedAssets;