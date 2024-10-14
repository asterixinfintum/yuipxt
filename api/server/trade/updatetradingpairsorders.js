import Pair from '../models/pair';

async function updatetradingpairsorders(pairid) {
    try {
        const pairitem = await Pair.findOne({ _id: pairid })
        const result = processPair(pairitem)

        return result;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error; // Or handle it as needed
    }
}

const processPair = async (pair) => {
    function getRandomPrice(basePrice, maxVariation) {
        // Generate a random number within the range of -maxVariation to +maxVariation
        const variation = (Math.random() * maxVariation * 2) - maxVariation;

        // Add the variation to the base price and ensure the result is not negative
        const newPrice = Math.max(0, basePrice + variation).toFixed(8);

        return parseFloat(newPrice); // Convert string back to a float, with precision for small values
    }

    const pairitem = await Pair.findOne({ _id: pair._id });

    const getRandomValue = () => Math.random() < 0.5 ? parseFloat((Math.random() * 0.009 + 0.001).toFixed(4)) : parseFloat((Math.random() * 7 + 1).toFixed(4));
    let ordersresult = [];

    const orders = await Promise.all(
        Array.from({ length: 120 }, async (_, i) => {
            const calculateprice = await pairitem.calculatePrice();
            const price = getRandomPrice(calculateprice, 1); // Ensure getRandomPrice function is defined
            const amount = getRandomValue();
            const total = amount * price;

            // Set 'side' based on whether 'i' is even or odd
            const side = i % 2 === 0 ? 'buy' : 'sell';

            const dumborder = { price, amount, total, side };
            return dumborder;
        })
    );

    ordersresult = orders;

    return ordersresult;
    //
    //console.log(pairitem.pair, pairitemprice);
    //pairitem.gendumborders();
    //console.log(pairitem.pair)
};


export default updatetradingpairsorders;