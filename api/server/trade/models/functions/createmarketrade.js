import Asset from '../../../models/asset';
import Autotrade from '../../models/autotrade';
import simulateprofit from './simulateprofit';
import simulateloss from './simulateloss';

function findGreaterValue(value1, value2) {
    if (value1 > value2) {
        return value1;
    } else if (value2 > value1) {
        return value2;
    } else {
        return "Both values are equal";
    }
}

async function createmarketrade(autotrade, i) {

    try {
        //the asset to buy or sell are meant to be returned based on the operation below
        const tradeStatus = autotrade.tradeStatus;
        const assetinhold = await Asset.findOne({ _id: autotrade.assettobuy });
        const assetoutofhold = await Asset.findOne({ _id: autotrade.assettosell });

        if (assetinhold && assetoutofhold) {
            if (!autotrade.initialusddeposit) {
                const initialusddeposit = autotrade.quantity * autotrade.price;
                const autotrd = await Autotrade.findOne({ _id: autotrade._id });
                autotrd.initialusddeposit = initialusddeposit;

                await autotrd.save();
            }

            if (autotrade.initialusddeposit) {
               
                const usdval = autotrade.usdbalance ? autotrade.usdbalance : autotrade.initialusddeposit;
                let buyorder;
                let sellorder;
                let currentusdbalance;

                let assetaorder;
                let assetborder;

                if (tradeStatus === 'profit') {
                    assetaorder = await simulateprofit(assetinhold, usdval);
                    assetborder = await simulateprofit(assetoutofhold, usdval);
                }

                if (tradeStatus === 'loss') {
                    assetaorder = await simulateloss(assetinhold, usdval);
                    assetborder = await simulateloss(assetoutofhold, usdval);
                }

                if (assetaorder && !assetborder) {
                    if (assetaorder.side === 'buy') {
                        buyorder = assetaorder;
                        currentusdbalance = buyorder.total;

                        //console.log(currentusdbalance);
                    }

                    if (assetaorder.side === 'sell') {
                        sellorder = assetaorder;
                    }
                }

                if (!assetaorder && assetborder) {
                    if (assetborder.side === 'buy') {
                        buyorder = assetborder;
                        currentusdbalance = buyorder.total;

                        //console.log(currentusdbalance);
                    }

                    if (assetborder.side === 'sell') {
                        sellorder = assetborder;
                    }
                }


                if (assetaorder && assetborder) {
                    if (assetaorder.side !== 'buy' && assetborder.side === 'buy') {
                        buyorder = assetborder;
                        sellorder = assetaorder;
                        currentusdbalance = buyorder.total;

                        //console.log(currentusdbalance);
                    } else if (assetaorder.side === 'buy' && assetborder.side !== 'buy') {
                        buyorder = assetaorder;
                        sellorder = assetborder;
                        currentusdbalance = buyorder.total;

                        //console.log(currentusdbalance);
                    } else if (assetaorder.side === 'buy' && assetborder.side === 'buy') {
                        const greaterval = findGreaterValue(assetaorder.total, assetborder.total);

                        if (greaterval === assetaorder.total) {
                            buyorder = assetaorder;
                            sellorder = null;
                            currentusdbalance = buyorder.total;

                            console.log(currentusdbalance);
                        } else if (greaterval === assetborder.total) {
                            buyorder = assetborder;
                            sellorder = null;
                            currentusdbalance = buyorder.total
                        } else {
                            buyorder = assetborder;
                            sellorder = null;
                            currentusdbalance = buyorder.total;

                            //console.log(currentusdbalance);
                        }
                    } else if (assetaorder.side === 'sell' && assetborder.side === 'sell') {
                        const greaterval = findGreaterValue(assetaorder.total, assetborder.total);

                        if (greaterval === assetaorder.total) {
                            buyorder = null;
                            sellorder = assetborder;
                        } else if (greaterval === assetborder.total) {
                            buyorder = null;
                            sellorder = assetaorder;
                        } else {
                            buyorder = null;
                            sellorder = assetaorder;
                        }
                    }
                }

                const autotrd = await Autotrade.findOne({ _id: autotrade._id });
                const neworders = [];

                if (buyorder !== null && buyorder !== undefined) {
                    neworders.push(buyorder);
                }

                if (sellorder !== null && sellorder !== undefined) {
                    neworders.push(sellorder);
                }

                const autotradeorders = [...neworders, ...autotrd.orders];
                autotrd.orders = autotradeorders;
               
                if (currentusdbalance) {
                    autotrd.usdbalance = currentusdbalance;
                }

                autotrd.save();

                //console.log(autotrd, currentusdbalance);
            }
        }

    } catch (error) {
        console.log(error);
        console.log(currentusdbalance, 'see err')
    }
}

export default createmarketrade;