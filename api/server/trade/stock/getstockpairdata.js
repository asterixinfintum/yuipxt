import fetch from 'node-fetch';

import CTD from '../models/ctd';
import Asset from '../../models/asset';

import symbols from './stockSymbols';

const base_url = `${process.env.ALKSTOCKURL}`;

async function getstockpairdata() {
    symbols.forEach(async ({ symbol, name }) => {
        let assetid;

        try {
            const asset = await Asset.findOne({ name, assetType: 'stock' });

            const response = await fetch(`${base_url}/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALK}`);
            const result = await response.json();

            const meta = result['Meta Data'];
            const values = processStockdata(result['Time Series (Daily)']);

            if (asset) {
                assetid = asset._id;

                if (values[0]) {
                    const price = values[0].close;
                    Asset.updateAssetPrice(assetid, price);
                }
            }

            if (meta && meta !== undefined && values && values !== undefined) {
                //console.log(meta, values);
                const currency_base = name;
                const currency_quote = "US Dollar";
                const exchange = 'none';

                const ctd = await CTD.findOne({ symbol, currency_base, currency_quote });

                if (ctd) {
                    const valuesarr = ctd.values;
                    const _id = ctd._id;

                    if (ctd.assetid.length === 0) {
                        const update = await CTD.findOneAndUpdate(
                            { _id },
                            {
                                $set: {
                                    assetid
                                }
                            },
                            { new: true }
                        );

                        //console.log(update, 'updated assetid');
                    }

                    const update = await CTD.findOneAndUpdate(
                        { _id },
                        {
                            $set: {
                                value: [...values, ...valuesarr]
                            }
                        },
                        { new: true }
                    );

                    //console.log(update, 'updated')
                }

                if (!ctd) {
                    const newctd = new CTD({
                        symbol,
                        currency_base,
                        currency_quote,
                        exchange,
                        values,
                        assetid,
                        assettype: 'stock'
                    });

                    await newctd.save();

                    console.log(newctd, 'saved/added')
                }
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function processStockdata(stockdata) {
    let dt = [];

    try {
        const dataLength = Object.keys(stockdata).length;


        for (let date in stockdata) {
            const dtobj = {}
            dtobj.datetime = date;
            for (let metric in stockdata[date]) {
                let cleanedMetric = metric.replace(/[0-9. ]/g, '');

                dtobj[cleanedMetric] = parseInt(stockdata[date][metric], 10);
            }

            dt = [...dt, ...[dtobj]];

            if (dt.length >= dataLength) {
                return dt;
            }
        }
    } catch (error) {
        return dt;
    }
}

export default getstockpairdata;