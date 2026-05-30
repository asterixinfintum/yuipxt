import Asset from '../models/asset';
import Pair from '../models/pair';

async function generateFiatTradingPairs() {
    // Fetch all assets and filter to only fiat currencies
    const allAssets = await Asset.find();
    const fiatAssets = allAssets.filter(asset => asset.assetType === 'fiat');

    if (fiatAssets.length === 0) {
        console.log('No fiat assets found in the database');
        return;
    }

    console.log(`Found ${fiatAssets.length} fiat assets, generating pairs...`);

    const pairs = [];

    // Generate all possible fiat-to-fiat pairs
    for (let i = 0; i < fiatAssets.length; i++) {
        for (let j = i + 1; j < fiatAssets.length; j++) {
            // Pair 1: asset[i] as base, asset[j] as quote
            const pair1 = {
                baseAssetId: fiatAssets[i]._id,
                baseAsset: fiatAssets[i].symbol,
                quoteAsset: fiatAssets[j].symbol,
                quoteAssetId: fiatAssets[j]._id,
                baseAssetType: fiatAssets[i].assetType,
                quoteAssetType: fiatAssets[j].assetType,
                pair: `${fiatAssets[i].symbol}/${fiatAssets[j].symbol}`,
                price: parseFloat(fiatAssets[i].price) / parseFloat(fiatAssets[j].price)
            };
            
            // Pair 2: asset[j] as base, asset[i] as quote (inverse pair)
            const pair2 = {
                baseAssetId: fiatAssets[j]._id,
                baseAsset: fiatAssets[j].symbol,
                quoteAsset: fiatAssets[i].symbol,
                quoteAssetId: fiatAssets[i]._id,
                baseAssetType: fiatAssets[j].assetType,
                quoteAssetType: fiatAssets[i].assetType,
                pair: `${fiatAssets[j].symbol}/${fiatAssets[i].symbol}`,
                price: parseFloat(fiatAssets[j].price) / parseFloat(fiatAssets[i].price)
            };
            
            pairs.push(pair1, pair2);
        }
    }

    console.log(`Generated ${pairs.length} total fiat pairs to create`);

    // Save pairs to database if they don't already exist
    let createdCount = 0;
    let skippedCount = 0;

    for (const pair of pairs) {
        try {
            const existingPair = await Pair.findOne({ pair: pair.pair });

            if (!existingPair) {
                const newPair = new Pair(pair);
                await newPair.save();
                console.log(`✓ Created: ${newPair.pair}`);
                createdCount++;
            } else {
                console.log(`○ Skipped (exists): ${pair.pair}`);
                skippedCount++;
            }
        } catch (error) {
            console.log(`✗ Error creating pair ${pair.pair}:`, error.message);
        }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Fiat assets found: ${fiatAssets.length}`);
    console.log(`Pairs created: ${createdCount}`);
    console.log(`Pairs skipped (already exist): ${skippedCount}`);
    console.log(`Total pairs processed: ${pairs.length}`);
}

export default generateFiatTradingPairs;