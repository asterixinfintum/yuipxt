function convertToFloat(str) {
    return parseFloat(str.replace(/,/g, ''));
}

async function simulateprofit(asset, usdval) {
    //1) if an asset has a price history, record a buy before, if the price rose, and a sell 
    //before, if the price fell

    //2)record profit with usdval * percentagechange of price rice

    //3) outside this function pick the greater value in usd as the autotrade current balance

    let order;
    console.log(usdval, 'usdval')

    if (asset.pricehistory.length && asset.pricehistory.length > 3) {
        const dropinvalue = asset.pricehistory[0].dropinvalue;

        if (dropinvalue) {
            order = {
                side: 'sell',
                priceatsell: asset.pricehistory[1].price,
                quantity: convertToFloat(`${usdval}`) / convertToFloat(`${asset.pricehistory[1].price}`)
            }
        }

        if (!dropinvalue) {
            order = {
                side: 'buy',
                quantity: convertToFloat(`${usdval}`) / convertToFloat(`${asset.pricehistory[1].price}`),
                priceatbuy: asset.pricehistory[1].price,
                profit: ((asset.pricehistory[0].percentagechange * convertToFloat(`${usdval}`)) / 100),
                total: (((asset.pricehistory[0].percentagechange * convertToFloat(`${usdval}`)) / 100) + convertToFloat(`${usdval}`))
            }
        }

        return order;
    } else {
        return false
    }
}


export default simulateprofit;