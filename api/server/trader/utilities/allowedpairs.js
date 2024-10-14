import Asset from '../../models/asset';
import AllowedPair from '../../models/allowedpair';

const allowedpairs = [
    {
        type: 'crypto',
        pairlabel: "MEXC:UNIUSDT",
        pair: "UNI/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "MEXC:UNIETH",
        pair: "UNI/ETH"
    },
    {
        type: 'crypto',
        pairlabel: "MEXC:UNIUSDC",
        pair: "UNI/USDC"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:UNIBTC",
        pair: "UNI/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:UNIBNB",
        pair: "UNI/BNB"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:XRPUSDT",
        pair: "XRP/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:XRPBTC",
        pair: "XRP/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:XRPUSD",
        pair: "XRP/USD"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:XRPBNB",
        pair: "XRP/BNB"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:XRPETH",
        pair: "XRP/ETH"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:BTCUSD",
        pair: "BTC/USD"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:BTCUSDT",
        pair: "BTC/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "POLONIEX:BTCBNB",
        pair: "BTC/BNB"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:ETHUSD",
        pair: "ETH/USD"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:ETHUSDT",
        pair: "ETH/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:ETHUSDC",
        pair: "ETH/USDC"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:ETHBTC",
        pair: "ETH/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "POLONIEX:ETHTRX",
        pair: "ETH/TRX"
    },
    {
        type: 'crypto',
        pairlabel: "POLONIEX:XMRBTC",
        pair: "XMR/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "POLONIEX:XMRUSD",
        pair: "XMR/USD"
    },
    {
        type: 'crypto',
        pairlabel: "POLONIEX:XMRUSDT",
        pair: "XMR/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "POLONIEX:XMRUSDC",
        pair: "XMR/USDC"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:XMRETH",
        pair: "XMR/ETH"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:XMRBNB",
        pair: "XMR/BNB"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:DOGEUSDT",
        pair: "DOGE/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:DOGEUSD",
        pair: "DOGE/USD"
    },
    {
        type: 'crypto',
        pairlabel: "POLONIEX:DOGEBTC",
        pair: "DOGE/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "POLONIEX:DOGEUSDC",
        pair: "DOGE/USDC"
    },

    {
        type: 'crypto',
        pairlabel: "POLONIEX:POLYUSD",
        pair: "POLY/USD"
    },
    {
        type: 'crypto',
        pairlabel: "POLONIEX:POLYUSDT",
        pair: "POLY/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "POLONIEX:POLYBTC",
        pair: "POLY/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:ADAUSDT",
        pair: "ADA/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "COINBASE:ADAUSD",
        pair: "ADA/USD"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:ADABTC",
        pair: "ADA/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "COINBASE:ADAETH",
        pair: "ADA/ETH"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:ADABNB",
        pair: "ADA/BNB"
    },
    {
        type: 'crypto',
        pairlabel: "BITTREX:ADAUSDC",
        pair: "ADA/USDC"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:BATUSDT",
        pair: "BAT/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "BITSTAMP:BATUSD",
        pair: "BAT/USD"
    },
    {
        type: 'crypto',
        pairlabel: "GEMINI:BATBTC",
        pair: "BAT/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "GEMINI:BATETH",
        pair: "BAT/ETH"
    },
    {
        type: 'crypto',
        pairlabel: "KRAKEN:BATUSD",
        pair: "BAT/USD"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:TRXUSDT",
        pair: "TRX/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:TRXUSD",
        pair: "TRX/USD"
    },
    {
        type: 'crypto',
        pairlabel: "BITFINEX:TRXETH",
        pair: "TRX/ETH"
    },
    {
        type: 'crypto',
        pairlabel: "OKX:TRXBTC",
        pair: "TRX/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:TRXXRP",
        pair: "TRX/XRP"
    },
    {
        type: 'crypto',
        pairlabel: "BITRUE:TRXADA",
        pair: "TRX/ADA"
    },

    {
        type: 'crypto',
        pairlabel: "BINANCE:BNBUSDT",
        pair: "BNB/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:BNBUSD",
        pair: "BNB/USD"
    },
    {
        type: 'crypto',
        pairlabel: "OKX:BNBUSDC",
        pair: "BNB/USDC"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:BNBETH",
        pair: "BNB/ETH"
    },
    {
        type: 'crypto',
        pairlabel: "POLONIEX:BNBTRX",
        pair: "BNB/TRX"
    },
    {
        type: 'crypto',
        pairlabel: "KUCOIN:BNBBTC",
        pair: "BNB/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:EOSUSDT",
        pair: "EOS/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "BITFINEX:EOSUSD",
        pair: "EOS/USD"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:EOSUSDT",
        pair: "EOS/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "COINBASE:EOSBTC",
        pair: "EOS/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "BITFINEX:EOSETH",
        pair: "EOS/ETH"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:DASHUSDT",
        pair: "DASH/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "COINBASE:DASHBTC",
        pair: "DASH/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "COINBASE:DASHUSD",
        pair: "DASH/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "POLONIEX:DASHUSDC",
        pair: "DASH/USDC"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:DASHETH",
        pair: "DASH/ETH"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:MKRUSDT",
        pair: "MKR/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "BITFINEX:MKRUSD",
        pair: "MKR/USD"
    },
    {
        type: 'crypto',
        pairlabel: "BITFINEX:MKRBTC",
        pair: "MKR/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "KUCOIN:MKRETH",
        pair: "MKR/ETH"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:NEOUSDT",
        pair: "NEO/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "BITFINEX:NEOUSD",
        pair: "NEO/USD"
    },
    {
        type: 'crypto',
        pairlabel: "BITFINEX:NEOBTC",
        pair: "NEO/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "BITFINEX:NEOETH",
        pair: "NEO/ETH"
    },
    {
        type: 'crypto',
        pairlabel: "POLONIEX:NEOTRX",
        pair: "NEO/TRX"
    },
    {
        type: 'crypto',
        pairlabel: "COINBASE:LINKUSD",
        pair: "LINK/USD"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:LINKUSDT",
        pair: "LINK/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "BITFINEX:LINKBTC",
        pair: "LINK/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "GEMINI:LINKETH",
        pair: "LINK/ETH"
    },
    {
        type: 'crypto',
        pairlabel: "POLONIEX:LINKTRX",
        pair: "LINK/TRX"
    },
    {
        type: 'crypto',
        pairlabel: "KRAKEN:BCHUSDZ2023",
        pair: "BCH/USD"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:BCHUSDT",
        pair: "BCH/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "BITTREX:BCHBTC",
        pair: "BCH/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "BITTREX:BCHETH",
        pair: "BCH/ETH"
    },
    {
        type: 'crypto',
        pairlabel: "COINBASE:LTCUSD",
        pair: "LTC/USD"
    },
    {
        type: 'crypto',
        pairlabel: "BYBIT:LTCUSDT",
        pair: "LTC/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:LTCBTC",
        pair: "LTC/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "GEMINI:LTCETH",
        pair: "LTC/ETH"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:SNXUSD",
        pair: "SNX/USD"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:SNXUSDT",
        pair: "SNX/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "BITFINEX:SNXBTC",
        pair: "SNX/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:SNXETH",
        pair: "SNX/ETH"
    },
    {
        type: 'crypto',
        pairlabel: "BITRUE:XLMXRP",
        pair: "XLM/XRP"
    },
    {
        type: 'crypto',
        pairlabel: "BITFINEX:XLMUSD",
        pair: "XLM/USD"
    },
    {
        type: 'crypto',
        pairlabel: "KUCOIN:XLMUSDT",
        pair: "XLM/USDT"
    },
    {
        type: 'crypto',
        pairlabel: "BITFINEX:XLMBTC",
        pair: "XLM/BTC"
    },
    {
        type: 'crypto',
        pairlabel: "BINANCE:XLMETH",
        pair: "XLM/ETH"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:T",
        pair: "T/USD"
    },
    {
        type: 'stock',
        pairlabel: "NASDAQ:TSLA",
        pair: "TSLA/USD"
    },
    {
        type: 'stock',
        pairlabel: "BCS:FB",
        pair: "FB/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:JPM",
        pair: "JPM/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:VALE",
        pair: "VALE/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:C",
        pair: "C/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:GE",
        pair: "GE/USD"
    },
    {
        type: 'stock',
        pairlabel: "NASDAQ:MSFT",
        pair: "MSFT/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:GM",
        pair: "GM/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:NIO",
        pair: "NIO/USD"
    },
    {
        type: 'stock',
        pairlabel: "NASDAQ:INTC",
        pair: "INTC/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:NOK",
        pair: "NOK/USD"
    },
    {
        type: 'stock',
        pairlabel: "NASDAQ:NVDA",
        pair: "NVDA/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:KO",
        pair: "KO/USD"
    },
    {
        type: 'stock',
        pairlabel: "NASDAQ:AAL",
        pair: "AAL/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:WFC",
        pair: "WFC/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:F",
        pair: "F/USD"
    },
    {
        type: 'stock',
        pairlabel: "NASDAQ:AAPL",
        pair: "AAPL/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:BAC",
        pair: "BAC/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:CCL",
        pair: "CCL/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:BA",
        pair: "BA/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:UBER",
        pair: "UBER/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:M",
        pair: "M/USD"
    },
    {
        type: 'stock',
        pairlabel: "NASDAQ:AMD",
        pair: "AMD/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:DIS",
        pair: "DIS/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:PFE",
        pair: "PFE/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:SNAP",
        pair: "SNAP/USD"
    },
    {
        type: 'stock',
        pairlabel: "NYSE:XOM",
        pair: "XOM/USD"
    },

    {
        type: 'commodity',
        pairlabel: "ACTIVTRADES:WHEATH2024",
        pair: "WHEAT/USD"
    },
    {
        type: 'commodity',
        pairlabel: "CAPITALCOM:NATURALGAS",
        pair: "NATURAL_GAS/USD"
    },
    {
        type: 'commodity',
        pairlabel: "BLACKBULL:BRENT",
        pair: "BRENT/USD"
    },
    {
        type: 'commodity',
        pairlabel: "NCDEX:COTTON",
        pair: "COTTON/USD"
    },
    {
        type: 'commodity',
        pairlabel: "CAPITALCOM:COPPER",
        pair: "COPPER/USD"
    },
    {
        type: 'commodity',
        pairlabel: "CAPITALCOM:ALUMINUM",
        pair: "ALUMINUM/USD"
    },
    {
        type: 'commodity',
        pairlabel: "PEPPERSTONE:COFFEE",
        pair: "COFFEE/USD"
    },
    {
        type: 'commodity',
        pairlabel: "AMEX:CORN",
        pair: "CORN/USD"
    },
    {
        type: 'commodity',
        pairlabel: "OANDA:SUGARUSD",
        pair: "SUGAR/USD"
    },
    {
        type: 'commodity',
        pairlabel: "BLACKBULL:WTI",
        pair: "WTI/USD"
    },
    {
        type: 'commodity',
        pairlabel: "TSXV:TIN",
        pair: "Tin/USD"
    },
    {
        type: 'commodity',
        pairlabel: "MEXC:TINUSDT",
        pair: "Tin/USDT"
    },
    {
        type: 'commodity',
        pairlabel: "CAPITALCOM:GOLD",
        pair: "Gold/USD"
    },
    {
        type: 'commodity',
        pairlabel: "SKILLING:NICKEL",
        pair: "Nickel/USD"
    },
    {
        type: 'commodity',
        pairlabel: "CBOT:EH1!",
        pair: "Ethanol/USD"
    },
    {
        type: 'commodity',
        pairlabel: "CAPITALCOM:PALLADIUM",
        pair: "Palladium/USD"
    },
    {
        type: 'commodity',
        pairlabel: "CAPITALCOM:SILVER",
        pair: "Silver/USD"
    },
    {
        type: 'commodity',
        pairlabel: "SWB:OD7I",
        pair: "Heating Oil/USD"
    },
    {
        type: 'commodity',
        pairlabel: "CAPITALCOM:PLATINUM",
        pair: "Platinum/USD"
    },
    {
        type: 'commodity',
        pairlabel: "IDX:COAL",
        pair: "Coal/USD"
    },
    {
        type: 'commodity',
        pairlabel: "TRADEGATE:B4N2",
        pair: "RBOB Gasoline/USD"
    },
    {
        type: 'commodity',
        pairlabel: "AMEX:UEC",
        pair: "Uranium/USD",
    },
    {
        type: 'commodity',
        pairlabel: "BLACKBULL:BRENT",
        pair: "Oil (Brent)/USD",
    },
    {
        type: 'commodity',
        pairlabel: "BLACKBULL:WTI",
        pair: "Oil (WTI)/USD",
    },
    {
        type: 'commodity',
        pairlabel: "PEPPERSTONE:ALUMINIUM",
        pair: "Aluminium/USD",
    },
    {
        type: 'commodity',
        pairlabel: "NCDEX:LEAD",
        pair: "Lead/USD",
    },
    {
        type: 'commodity',
        pairlabel: "FWB:NIO",
        pair: "Iron Ore/USD",
    },
    {
        type: 'commodity',
        pairlabel: "MIL:HOGS",
        pair: "Lean Hog/USD",
    },
    {
        type: 'commodity',
        pairlabel: "PEPPERSTONE:OATS",
        pair: "Oats/USD",
    },
    {
        type: 'commodity',
        pairlabel: "PEPPERSTONE:LUMBER",
        pair: "Lumber/USD",
    },
    {
        type: 'commodity',
        pairlabel: "VANTAGE:COCOA",
        pair: "Cocoa/USD",
    },
    {
        type: 'commodity',
        pairlabel: "NASDAQ:NQCILCER",
        pair: "Live Cattle/USD",
    },
    {
        type: 'commodity',
        pairlabel: "NASDAQ:NQCIFCER",
        pair: "Feeder Cattle/USD",
    },
    {
        type: 'commodity',
        pairlabel: "NEO:MILK",
        pair: "Milk/USD",
    },
    {
        type: 'commodity',
        pairlabel: "POLONIEX:MILKUSDT",
        pair: "Milk/USDT",
    },
    {
        type: 'commodity',
        pairlabel: "ICEUS:OJ1!",
        pair: "Orange Juice/USD",
    },
    {
        type: 'commodity',
        pairlabel: "SET:UVAN",
        pair: "Palm Oil/USD",
    },
    {
        type: 'commodity',
        pairlabel: "FRED:PROILUSDM",
        pair: "Rapeseed/USD",
    },
    {
        type: 'commodity',
        pairlabel: "MEXC:RICEUSDT",
        pair: "Rice/USDT",
    },
    {
        type: 'commodity',
        pairlabel: "CBOT:TRF1!",
        pair: "Rice/USD",
    },
    {
        type: 'commodity',
        pairlabel: "NCDEX:ZINC",
        pair: "Zinc/USD",
    },
    {
        type: 'commodity',
        pairlabel: "NASDAQ:NQCISMER",
        pair: "Soybean Meal/USD",
    },
    {
        type: 'commodity',
        pairlabel: "FPMARKETS:SOYBEANS",
        pair: "Soybeans/USD",
    },
    {
        type: 'commodity',
        pairlabel: "TRADEGATE:OD7P",
        pair: "Soybean Oil/USD",
    }
];

function generateRandomPercentageWithDirectionAndColor() {
    // Generate a random percentage between 1 and 11
    const percentage = Math.random() * 10 + 1;

    // Randomly choose 'up' or 'down'
    const isUp = Math.random() < 0.5;
    const direction = isUp ? '#0ecb81' : 'down';

    // Format the percentage with the correct sign and precision
    const formattedPercentage = isUp
        ? `+${percentage.toFixed(2)}%`
        : `-${percentage.toFixed(2)}%`;

    // Assign colors
    const color = isUp ? 'green' : '#f6465d';

    // Return an object with the formatted percentage, direction, and color
    return {
        percentage: formattedPercentage,
        direction,
        color
    };
}

async function getSanitizedPairs(allowedpairs) {

    function processDBData(inputData) {
        return inputData.map(item => ({
            type: item.type,
            pairlabel: item.pairlabel,
            pair: item.pair
        }));
    }

    const allowedPairsFromDB = await AllowedPair.find();

    const dbDataProcessed = processDBData(allowedPairsFromDB)

    const allAllowedPairs = [...allowedpairs, ...dbDataProcessed]

    const sanitizedPromises = allAllowedPairs.map(async pair => {
        const [left, right] = pair.pair.split('/');

        const base = await Asset.findOne({ symbol: left });
        const quote = await Asset.findOne({ symbol: right });
        let price;
        let leftid;
        let rightid;
        let lefttype;
        let righttype;

        if (base && quote) {
            price = (base.price / quote.price).toFixed(3);
            leftid = base._id;
            rightid = quote._id;
            lefttype = base.assetType;
            righttype = quote.assetType;
        } else {
            price = 0;
            leftid = null;
            rightid = null;
            lefttype = null;
            righttype = null;
        }

        return {
            ...pair,
            left,
            right,
            leftid,
            rightid,
            lefttype,
            righttype,
            price,
            change: generateRandomPercentageWithDirectionAndColor()
        };
    });

    const sanitized = await Promise.all(sanitizedPromises);
    return sanitized;
}

async function processPairs() {
    try {
        const sanitizedPairs = await getSanitizedPairs(allowedpairs);

        return sanitizedPairs;
    } catch (error) {
        console.error('Error processing pairs:', error);
    }
}

export default processPairs;