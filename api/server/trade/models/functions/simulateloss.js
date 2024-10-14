function convertToFloat(str) {
    return parseFloat(str.replace(/,/g, ''));
}

async function simulateloss(asset, usdval) {
    let order;

    if (asset.pricehistory.length && asset.pricehistory.length > 3) {
        const dropinvalue = asset.pricehistory[0].dropinvalue;

        if (dropinvalue) {
            order = {
                side: 'buy',
                quantity: convertToFloat(`${usdval}`) / convertToFloat(`${asset.pricehistory[1].price}`),
                priceatbuy: asset.pricehistory[1].price,
                loss: ((asset.pricehistory[0].percentagechange * convertToFloat(`${usdval}`)) / 100),
                total: (((asset.pricehistory[0].percentagechange * convertToFloat(`${usdval}`)) / 100) - convertToFloat(`${usdval}`))
            }
        }

        if (!dropinvalue) {
            order = {
                side: 'sell',
                priceatsell: asset.pricehistory[1].price,
                quantity: convertToFloat(`${usdval}`) / convertToFloat(`${asset.pricehistory[1].price}`),
            }
        }

        return order;

    } else {
        return false
    }
}

export default simulateloss;