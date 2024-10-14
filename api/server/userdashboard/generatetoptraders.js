import cron from "node-cron";

const profitrange = 100000;
const stakelstart = 100000
const stakelimit = 500000;

function roundToNearestWhole(number) {
    return Math.round(number);
}

function formatNumberForSpecificLocale(number, locale = 'en-US') {
    return number.toLocaleString(locale);
}

const generatetoptraders = async () => {
    const setlength = 4;
    const arrayOfObjects = [];

    for (let i = 0; i < setlength; i++) {
        const stake = Math.floor(Math.random() * (stakelstart - stakelimit + 1)) + stakelimit; // Random number between 500000 and 1000000
        const profit = Math.floor(Math.random() * profitrange); // Random number for profit, adjust range as needed
        const profitPercentage = roundToNearestWhole((profit / stake) * 100); // Calculating profit percentage

        arrayOfObjects.push({
            stake: formatNumberForSpecificLocale(stake),
            profit: formatNumberForSpecificLocale(profit),
            profitPercentage
        });
    }

    return arrayOfObjects;
}

cron.schedule('*/20 * * * * *', async () => {
    generatetoptraders();
});

export default generatetoptraders;