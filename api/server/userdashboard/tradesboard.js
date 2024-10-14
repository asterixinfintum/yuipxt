function formatNumberForSpecificLocale(number, locale = 'en-US') {
    return number.toLocaleString(locale);
}

const onlinetradersstart = 1000000;
const onlinetraderslimit = 2000000;

const tradesamountstart = 500000;
const tradesamountlimit = 5000000;

async function tradesboard() {
    function generateUniqueRandomNumber(excludeNumbers) {
        let number;
        do {
            number = Math.floor(Math.random() * (tradesamountstart - tradesamountlimit + 1)) + tradesamountlimit;
        } while (excludeNumbers.includes(number));
        return number;
    }

    const markettrades = generateUniqueRandomNumber([]);
    const limittrades = generateUniqueRandomNumber([markettrades]);
    const stoptrades = generateUniqueRandomNumber([markettrades, limittrades]);
    const onlinetraders = Math.floor(Math.random() * (onlinetradersstart - onlinetraderslimit + 1)) + onlinetraderslimit;

    const result = {
        markettrades: formatNumberForSpecificLocale(markettrades),
        limittrades: formatNumberForSpecificLocale(limittrades),
        stoptrades: formatNumberForSpecificLocale(stoptrades),
        onlinetraders: formatNumberForSpecificLocale(onlinetraders),
        totalvolume: formatNumberForSpecificLocale(markettrades + limittrades + stoptrades)
    }

    return result;
}

export default tradesboard;