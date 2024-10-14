import axios from 'axios';
import cheerio from 'cheerio';

import commoditySymbols from './commoditySymbols';
import Asset from '../../models/asset';

function removePercentage(str) {
    return str.includes('%') ? str.replace('%', '') : str;
}


async function updatecommodities() {
    const url = 'https://markets.businessinsider.com/commodities';

    axios.get(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const tableRows = $('.table__tr');

            tableRows.each(async function () {
                // Extract commodity name
                const name = $(this).find('a').text().trim();

                // Extract price change percentage
                const priceChange = $(this).find('td').eq(1).text().trim();

                // Extract current price
                const currentPrice = $(this).find('td').eq(2).text().trim();

                //console.log(`Name: ${name}, Price Change: ${priceChange}, Current Price: ${currentPrice}`);

                const datastring = `Name: ${name}, Price Change: ${priceChange}, Current Price: ${currentPrice}`;

                const commodity = {
                    name: getName(datastring),
                    symbol: getName(datastring),
                    image: '17nasdaq-logo-200.png',
                    price: removePercentage(getPrice(datastring)),
                }

                const alreadyinDB = commoditySymbols.find(commod => getName(datastring).includes(commod.name));

                if (!alreadyinDB) {
                    if (commodity.name.length) {
                        const newcommodity = new Asset({
                            name: commodity.name,
                            coin: commodity.name,
                            symbol: commodity.name,
                            assetType: "commodity",
                            image: commodity.image,
                            price: commodity.price,
                        });

                        //console.log(newcommodity);
                        //console.log("====================")

                        await newcommodity.save();
                    }
                }
            });
        })
        .catch(console.error);
}

function getName(str) {
    const namePart = str.split(', ')[0]; // Split by comma and take the first part
    return namePart.split(': ')[1]; // Split by colon and take the second part
}

function getPrice(str) {
    const priceChangePart = str.split(', ')[1]; // Split by comma and take the second part
    return priceChangePart.split(': ')[1]; // Split by colon and take the second part
}

function getCurrentPrice(str) {
    const currentPricePart = str.split(', ')[2]; // Split by comma and take the third part
    return currentPricePart.split(': ')[1]; // Split by colon and take the second part
}

function sanitizedata() {

}

export default updatecommodities;