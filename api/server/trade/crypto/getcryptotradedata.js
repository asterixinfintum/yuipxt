import getcryptopairs from './getcryptopairs';
import getcryptopairdata from './getcryptopairdata';

let timeout = 10000;
let tracker = 0;

async function getcryptotradedata() {
    const cryptopairs = await getcryptopairs();

    const runinterval = async () => {
        const cryptopairssubs = cryptopairs[tracker];
        await cryptopairssubs.forEach(({ symbol }) => {
            const pair = symbol;
            getcryptopairdata(pair);
        });

        tracker += 1;

        if (tracker <= cryptopairs.length - 1) {
            setTimeout(runinterval, timeout);
        } else {
            console.log('done')
        }
    }

    runinterval();
}

export default getcryptotradedata;