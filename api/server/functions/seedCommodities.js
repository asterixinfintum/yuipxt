import Asset from '../models/asset';
import commodities from '../utils/commoditySymbols';

/**
 * Seeds only commodities that don't already exist in the database
 * Uses name, symbol, and assetType to check for duplicates
 */
async function seedCommodities() {
    try {
        console.log('Starting commodity seeding...');
        
        // Get all existing commodities from the database
        const existingCommodities = await Asset.find({ assetType: 'commodity' });
        
        // Create a Set of existing commodity identifiers (using name+symbol+assetType)
        const existingKeys = new Set(
            existingCommodities.map(item => 
                `${item.name}|${item.symbol}|${item.assetType}`
            )
        );
        
        // Filter commodities that don't exist
        const newCommodities = commodities.filter(commodity => {
            const key = `${commodity.name}|${commodity.symbol}|commodity`;
            return !existingKeys.has(key);
        });
        
        if (newCommodities.length === 0) {
            console.log('All commodities already exist in the database. No new commodities to seed.');
            return { success: true, message: 'No new commodities to seed', seeded: 0 };
        }
        
        console.log(`Found ${newCommodities.length} new commodities to seed.`);
        
        // Seed the new commodities
        const seedPromises = newCommodities.map(async (commodity) => {
            try {
                const asset = {
                    name: commodity.name,
                    coin: commodity.symbol, // Using symbol as coin identifier
                    symbol: commodity.symbol,
                    assetType: 'commodity',
                    price: '1', // Initial default price
                    image: commodity.image,
                    listed: true
                };
                
                const newAsset = new Asset(asset);
                const savedAsset = await newAsset.save();
                console.log(`✅ Seeded: ${commodity.name} (${commodity.symbol})`);
                return savedAsset;
            } catch (error) {
                console.error(`❌ Error seeding ${commodity.name}:`, error.message);
                return null;
            }
        });
        
        const results = await Promise.all(seedPromises);
        const successfulSeeds = results.filter(result => result !== null);
        
        console.log(`✅ Successfully seeded ${successfulSeeds.length} commodities.`);
        
        return {
            success: true,
            message: `Seeded ${successfulSeeds.length} new commodities`,
            seeded: successfulSeeds.length,
            total: commodities.length
        };
        
    } catch (error) {
        console.error('Error seeding commodities:', error);
        return {
            success: false,
            message: 'Error seeding commodities',
            error: error.message
        };
    }
}

export default seedCommodities;