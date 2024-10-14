import fetch from 'node-fetch';

import CTD from '../models/ctd';
import Asset from '../../models/asset';

async function getcryptopairdata(pair) {
    try {
        const response = await fetch(`${process.env.TBASE}/time_series?symbol=${pair}&interval=1min&apikey=${process.env.TBASEK}&source=docs`);
        const result = await response.json();
        const data = result
        const meta = data.meta;
        const values = data.values

        if (meta && meta !== undefined && values && values !== undefined) {
            const { symbol, currency_base, currency_quote, exchange } = meta;

            const ctd = await CTD.findOne({ symbol, currency_base, currency_quote });
            const asset = await Asset.findOne({ name: currency_base, assetType: 'crypto' });
            let assetid;

            if (asset) {
                assetid = asset._id
            }

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

                    console.log(update, 'updated assetid');
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

                console.log(update, 'update here')
            }

            if (!ctd) {
                const newctd = new CTD({
                    symbol,
                    currency_base,
                    currency_quote,
                    exchange,
                    values,
                    assetid,
                    assettype: 'crypto'
                });

                await newctd.save();

                console.log(newctd, 'saved/added')
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export default getcryptopairdata;