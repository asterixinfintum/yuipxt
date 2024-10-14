import fetch from 'node-fetch';

import CTD from '../models/ctd';
import Asset from '../../models/asset';

import symbols from './commoditySymbols';

const base_url = `${process.env.ALKSTOCKURL}`;

async function getcommoditiesdata() {
    symbols.forEach(async ({ symbol, name }) => {
        try {
            const response = await fetch(`${base_url}/query?function=${symbol}&interval=monthly&apikey=${process.env.ALK}`);
            const result = await response.json();
            const values = result.data;

            if (result.name && values) {
                const currency_base = name;
                const currency_quote = "US Dollar";
                const exchange = 'none';
                const ctd = await CTD.findOne({ symbol, currency_base, currency_quote });
                const asset = await Asset.findOne({ name: currency_base, assetType: 'commodity' });
                let assetid;

                if (asset) {
                    assetid = asset._id
                    const price = values[0].value;
                    Asset.updateAssetPrice(assetid, price);
                }

                if (ctd) {
                    const valuesarr = ctd.values;
                    const _id = ctd._id;

                    if (!ctd.assetid) {
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
                }

                if (!ctd) {
                    const newctd = new CTD({
                        symbol,
                        currency_base,
                        currency_quote,
                        exchange,
                        values,
                        assetid,
                        assettype: 'commodity'
                    });

                    await newctd.save();

                    console.log(newctd, 'saved/added')
                }
            }
        } catch (error) {
            console.log(error)
        }
    })

    /*CTD.deleteMany({ asssetype: 'commodities' }, (err, count) => {
        if (err) console.error(err);
        console.log(`Deleted ${count} CTDs with assettype of commodities.`);
    });*/
}

export default getcommoditiesdata;