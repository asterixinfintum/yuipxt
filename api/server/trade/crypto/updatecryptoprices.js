import fetch from 'node-fetch';
import Asset from '../../models/asset';

async function updatecryptoprices() {
    try {
        const response = await fetch('https://api.poloniex.com/markets/price');
        const data = await response.json();
        const content = data.filter(item => item.symbol.includes('USDT'));
        const assets = await Asset.find({ assetType: 'crypto' });
        assets.forEach(async (asset, index) => {
            const assetpair = content.find(cnt => cnt.symbol.includes(asset.symbol));
            const assetprice = asset.name !== 'USD Coin' && asset.name !== 'Tether' ? assetpair.price : "1";

            if (assetpair) {
                const update = await Asset.findOneAndUpdate(
                    { _id: asset._id },
                    {
                        $set: {
                            price: assetprice
                        }
                    },
                    { new: true }
                );

                console.log(update)
            } else {
                console.log('fuck', index)
            }
        })

    } catch (error) {
        console.log(error)
    }
}

export default updatecryptoprices;