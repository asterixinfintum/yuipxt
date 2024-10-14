import AssetBlc from '../models/assetblc';

function containsObjectId(arr, id) {
    return arr.some(objId => objId.toString() === id.toString());
}

async function createAssetBlc(assetid, balance, wallet) {
    try {
        const nwassetblc = new AssetBlc({
            assetid,
            balance,
            wallet
        });

        const asstblc = await nwassetblc.save();
        return asstblc;
    } catch (error) {
        return null
    }
}

async function deposit(quantity, assetid) {
    return new Promise(async (resolve, reject) => {
        try {
            const assetblcs = this.assetBlcs;

            if (assetblcs.length) {
                const contains = containsObjectId(assetblcs, assetid);

                if (contains) {
                    const asstblc = await AssetBlc.findOne({ assetid, wallet: this.id });
                    await asstblc.increaseBalance(quantity);
                    resolve(asstblc);
                } else {
                    const asstblc = await createAssetBlc(assetid, quantity, this._id)

                    if (asstblc) {
                        assetblcs.push(assetid);
                        this.assetBlcs = assetblcs;
                        this.save();
                        resolve(asstblc)
                    }
                }
            } else {
                const asstblc = await createAssetBlc(assetid, quantity, this._id)

                if (asstblc) {
                    assetblcs.push(assetid);
                    this.assetBlcs = assetblcs;
                    this.save();
                    resolve(asstblc)
                }
            }
        } catch (error) {
            reject(error)
        }
    });
}

export default deposit;