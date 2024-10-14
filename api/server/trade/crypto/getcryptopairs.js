import fetch from 'node-fetch';

import symbols from './cryptoSymbols';

async function getcryptopairs() {
    try {
        const response = await fetch(`${process.env.TBASE}/cryptocurrencies?source=docs`)
        const result = await response.json();
        const data = result.data;
        const allowedsymbols = [];

        symbols.forEach(symbol => allowedsymbols.push(symbol.name));

        const pairs = await data.filter(dat => {
            return dat.available_exchanges.includes('Binance');
        });

        const allowedpairs = await pairs.filter(pair => allowedsymbols.includes(pair.currency_base));
        const list = splitArray(allowedpairs);
        return list;
    } catch (error) {
        console.log(error)
    }
}

function splitArray(arr) {
    const chunkSize = 10;
    const chunks = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
        chunks.push(arr.slice(i, i + chunkSize));
    }

    return chunks;
}

export default getcryptopairs;