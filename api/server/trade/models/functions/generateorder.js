import Pair from '../../../models/pair';

async function getPairsWithFewestOrders(specifiedLength) {
    try {
        const results = await Pair.aggregate([
            {
                $addFields: {
                    ordersLength: { $size: "$orders" }
                }
            },
            {
                $sort: { ordersLength: 1 }
            },
            {
                $limit: specifiedLength
            }
        ]);

        // Split results into 5 arrays
        const splitSize = Math.ceil(specifiedLength / 5);
        const splitResults = [];

        for (let i = 0; i < 5; i++) {
            const start = i * splitSize;
            const end = start + splitSize;
            splitResults.push(results.slice(start, Math.min(end, results.length)));
        }

        return splitResults; // Array of arrays
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function processPairsInParallel(splitResults) {
    // Map each sub-array to a promise
    const processingPromises = splitResults.map(subArray => {
        // Process each pair in the sub-array sequentially
        return subArray.reduce(async (previousPromise, pairData) => {
            await previousPromise; // Wait for the previous operation to complete
            try {
                const pair = await Pair.findById(pairData._id);
                await pair.gendumborders();
            } catch (error) {
                console.error('Error processing pair:', pairData._id, error);
            }
        }, Promise.resolve()); // Start with a resolved promise
    });

    // Wait for all sub-arrays to be processed
    await Promise.all(processingPromises);
}

async function generateorder() {
    getPairsWithFewestOrders(500).then(splitResults => {
        processPairsInParallel(splitResults).then(() => {
            console.log('All pairs processed in parallel.');
        });
    });
}

export default generateorder;