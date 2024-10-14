import fetch from 'node-fetch';

import Asset from '../models/asset';
import PriceHistory from '../models/pricehistory';

function convertToFloat(str) {
    return parseFloat(str.replace(/,/g, ''));
}

function calculatePercentageDifference(value1, value2) {
    const valueoneflt = convertToFloat(value1);
    const valuetwoflt = convertToFloat(value2);
    var difference = Math.abs(valueoneflt - valuetwoflt);
    var average = (valueoneflt + valuetwoflt) / 2;
    return (difference / average) * 100;
}

/**
 * Updates the price history of an asset.
 * @param {Object} asset - The asset object to update.
 */

 async function updatepricehistory(asset, date) {
    if (!asset || typeof asset.price === 'undefined') {
        throw new Error('Invalid asset or price');
    }

    try {
        // Fetch the latest version of the asset by its ID
        const assetinfo = await Asset.findById(asset._id);

        //console.log(assetinfo, date);

        const newpricehistory = new PriceHistory({
            asset: assetinfo._id,
            price: assetinfo.price,
            datetime: date
        });

        await newpricehistory.save();
        //console.log('price updated')
        
    } catch (error) {
        console.error('Failed to update price history:', error);
        // Handle the error or rethrow it
        throw error;
    }
}

async function getprices(date) {
    try {
        const stocks = await Asset.find({ assetType: 'stock' });
        const cryptos = await Asset.find({ assetType: 'crypto' });
        //const commodities = await Asset.find({ assetType: 'commodity' });

        // Process stocks and cryptos in parallel with controlled concurrency
        const stockUpdatePromises = stocks.map(stock => updatestockprice(stock, date));
        const cryptoUpdatePromises = cryptos.map(crypto => updatecryptoprice(crypto, date));
        //const commodityUpdatePromises = commodities.map(commodity => updatecommodityprice(commodity, date));

        await Promise.all([...stockUpdatePromises, ...cryptoUpdatePromises]);

    } catch (error) {
        console.error('Error in getPrices:', error);
    }
}

async function updatecryptoprice(asset, date) {
    try {
        const symbol = `${asset.symbol}/USD`; // Assuming cryptoAsset.symbol is something like 'BTC'

        if (asset.symbol === 'USD') {
            return await updatepricehistory(asset, date);
        }

        const url = `${process.env.TBASE}/exchange_rate?symbol=${symbol}&apikey=${process.env.TBASEK}&source=docs`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        if (result.status === 'error') {
            throw new Error(result.message);
        }

        asset.price = result.rate;
        await asset.save();

        await updatepricehistory(asset, date);
    } catch (error) {
        console.error(`Error updating crypto asset:`, asset.symbol, error);
    }
}

async function updatestockprice(asset, date) {
    try {
        const url = `${process.env.TBASE}/price?symbol=${asset.symbol}&apikey=${process.env.TBASEK}&source=docs`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        asset.price = result.price;
        await asset.save();

        await updatepricehistory(asset, date);
    } catch (error) {
        asset.faileddatafetch = true;
        console.error(`Error updating stock:`, asset.symbol, error);
    }
}

async function updatecommodityprice(asset, date) {
    try {
        const url = `${process.env.ALKSTOCKURL}/query?function=${asset.symbol}&interval=daily&apikey=${process.env.ALK}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        const { data } = result;

        if (data) {

            if (data[0].value !== '.') {
                const assetinfo = {
                    price: data[0].value
                }

                asset.price = assetinfo.price;
                await asset.save();

                await updatepricehistory(asset, date);
            }
        }

    } catch (error) {
        console.log(error)
    }
}

export default getprices;