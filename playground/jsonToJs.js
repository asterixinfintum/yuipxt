const fs = require('fs');
const path = require('path');


const cryptoSymbols = [
  { symbol: 'ADA', name: 'Cardano', image: 'cardano-ada-logo.svg' },
  /*{ symbol: 'LINK', name: 'Chainlink', image: 'chainlink-link-logo.svg' },
  { symbol: 'DASH', name: 'Dash', image: 'dash-dash-logo.svg' },
  { symbol: 'DOGE', name: 'Dogecoin', image: 'dogecoin-doge-logo.svg' },
  { symbol: 'EOS', name: 'EOS.IO', image: 'eos-eos-logo.svg' },
  { symbol: 'ETH', name: 'Ethereum', image: 'ethereum-eth-logo.svg' },
  { symbol: 'LTC', name: 'Litecoin', image: 'litecoin-ltc-logo.svg' },
  { symbol: 'MKR', name: 'Maker', image: 'maker-mkr-logo.svg' },
  { symbol: 'XMR', name: 'Monero', image: 'monero-xmr-logo.svg' },
  { symbol: 'NEO', name: 'NEO', image: 'neo-neo-logo.svg' },
  { symbol: 'POLY', name: 'Polymath', image: 'polymath-network-poly-logo.svg' },
  { symbol: 'XLM', name: 'Stellar Lumens', image: 'stellar-xlm-logo.svg' },
  { symbol: 'SNX', name: 'Synthetix', image: 'synthetix-snx-logo.svg' },
  { symbol: 'USDT', name: 'Tether', image: 'tether-usdt-logo.svg' },
  { symbol: 'TRX', name: 'TRON', image: 'tron-trx-logo.svg' },
  { symbol: 'UNI', name: 'Uniswap', image: 'uniswap-uni-logo.svg' },
  { symbol: 'XRP', name: 'XRP', image: 'xrp-xrp-logo.svg' }*/
];

async function readJsonFile() {
  try {
    const filePath = path.join(__dirname, 'cryptolist.json');
    const cryptolist = await fs.promises.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(cryptolist);
    const jsonDataRes = jsonData.data;

    cryptoSymbols.forEach(async (cryptoSymbol) => {
      const whatIwant = jsonDataRes.filter(currency => currency.symbol.includes(cryptoSymbol.symbol));
      const cryptoData = path.join(__dirname, 'cryptodata.json');

      fs.readFile(cryptoData, 'utf8', (err, data) => {
        if (err && err.code === 'ENOENT') {
          return fs.writeFile(path, JSON.stringify([whatIwant], null, 2), (writeErr) => {
            if (writeErr) {
              console.error('Error writing to file:', writeErr);
            } else {
              console.log('Data written successfully to data.json');
            }
          });

          return;
        }

        if (err) {
          return console.error('Error reading the file:', err);
        }

        const existingData = JSON.parse(data);
        const newData = [...existingData, ...whatIwant]

        fs.writeFile(cryptoData, JSON.stringify(newData, null, 2), (writeErr) => {
          if (writeErr) {
            console.error('Error writing to file:', writeErr);
          } else {
            console.log('Data appended successfully to data.json', cryptoSymbol);
          }
        });
      });
    });
  } catch (err) {
    console.error(`Error reading JSON file: ${err}`);
  }
}

readJsonFile();