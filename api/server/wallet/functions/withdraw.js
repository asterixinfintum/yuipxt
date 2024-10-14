import AssetBlc from '../models/assetblc';

function containsObjectId(arr, id) {
    return arr.some(objId => objId.toString() === id.toString());
}

async function withdraw(quantity, assetid) {
    return new Promise(async (resolve, reject) => {
        try {
            const assetblcs = this.assetBlcs;

            if (assetblcs.length) {
                const contains = containsObjectId(assetblcs, assetid);

                if (contains) {
                    const asstblc = await AssetBlc.findOne({ assetid, wallet: this.id });

                    if (asstblc.balance > quantity) {
                        await asstblc.reduceBalance(quantity);
                        resolve(asstblc)
                    } else {
                        reject('insufficient funds')
                    }
                } else {
                    reject('insufficient funds');
                }
            }
        } catch (error) {
            console.log(error)
            reject(error);
        }
    });
}

export default withdraw;