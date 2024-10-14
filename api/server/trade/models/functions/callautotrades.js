import AutoTrade from '../autotrade';

import createmarketrade from '../functions/createmarketrade';

async function callautotrades(limit) {
    try {
        const results = await AutoTrade.aggregate([
            {
                $addFields: {
                    ordersCount: { $size: "$orders" }
                }
            },
            {
                $sort: { ordersCount: 1 } // 1 for ascending order
            },
            {
                $limit: limit // Limit to the first 'limit' documents
            }
        ]);

        for (let i = 0; i < results.length; i++) {
            await createmarketrade(results[i], i);
        }

    } catch (error) {
        console.error(error);
    }
}

export default callautotrades;