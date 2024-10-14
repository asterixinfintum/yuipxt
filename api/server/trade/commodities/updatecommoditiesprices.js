import axios from 'axios';
import cheerio from 'cheerio';

import Asset from '../../models/asset';
import Pair from '../../models/pair';

const currentcommoditiespair = [
    'WHEAT/USD', 'NATURAL_GAS/USD', 'BRENT/USD',
    'COTTON/USD', 'COPPER/USD', 'ALUMINUM/USD', 'COFFEE/USD', 'CORN/USD', 'SUGAR/USD', 'WTI/USD', "Tin/USD",
    "Tin/USDT", "Gold/USD", "Nickel/USD", "Ethanol/USD", "Palladium/USD", "Silver/USD", "Heating Oil/USD", "Platinum/USD",
    "Coal/USD", "RBOB Gasoline/USD", "Uranium/USD", "Oil (Brent)/USD", "Oil (WTI)/USD", "Aluminium/USD", "Lead/USD",
    "Iron Ore/USD", "Lean Hog/USD", "Oats/USD", "Lumber/USD", "Cocoa/USD", "Live Cattle/USD", "Feeder Cattle/USD",
    "Milk/USD", "Milk/USDT", "Orange Juice/USD", "Palm Oil/USD", "Rapeseed/USD", "Rice/USDT", "Rice/USD", "Zinc/USD",
    "Soybean Meal/USD", "Soybeans/USD", "Soybean Oil/USD", "Soybean Oil/USD"
]

function removeLettersAndSpaces(str) {
    // This regular expression matches all letters and spaces
    const regex = /[a-zA-Z\s]/g;
    return str.replace(regex, '');
}

function categorizeStrings(str1, str2) {
    let withPercent = null;
    let withoutPercent = null;

    // Check if str1 contains '%'
    if (str1.includes('%')) {
        withPercent = str1;
    } else {
        withoutPercent = str1;
    }

    // Check if str2 contains '%'
    if (str2.includes('%')) {
        // If withPercent is already assigned, assign str2 to withoutPercent
        if (withPercent !== null) {
            withoutPercent = str2;
        } else {
            withPercent = str2;
        }
    } else {
        // If withoutPercent is already assigned, assign str2 to withPercent
        if (withoutPercent !== null) {
            withPercent = str2;
        } else {
            withoutPercent = str2;
        }
    }

    return { withPercent, withoutPercent };
}

async function updatecommoditiesprices(commodity) {
    const url = 'https://markets.businessinsider.com/commodities';

    axios.get(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            const tableRows = $('.table__tr');

            tableRows.each(async function () {
                const name = $(this).find('a').text().trim();

                // Extract price change percentage
                const priceChange = $(this).find('td').eq(1).text().trim();

                // Extract current price
                const currentPrice = $(this).find('td').eq(2).text().trim();

                //console.log(`name: ${name}`);

                const figuresobj = categorizeStrings(priceChange, currentPrice);

                //console.log(name, figuresobj);

                const commodi = await Asset.find({ name });

                commodi.forEach(async cm => {
                    cm.price = removeLettersAndSpaces(figuresobj.withoutPercent);
                    await cm.save();

                    const cmpairfilter = currentcommoditiespair.find(cmp => cmp.includes(name));

                    if (cmpairfilter) {
                        const commoditypair = await Pair.findOne({ pair: cmpairfilter });

                        commoditypair.pricedifference = figuresobj.withPercent;

                        await commoditypair.save();
                        //console.log(commoditypair);
                    }
                });
                //console.log("=============================================================");
            })
        })
        .catch(console.error);
}

export default updatecommoditiesprices;
