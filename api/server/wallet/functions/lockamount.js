import AssetBlc from "../models/assetblc";

function containsObjectId(arr, id) {
    return arr.some(objId => objId.toString() === id.toString());
}

async function lockamount(quantity, assetid) {
    return new Promise(async (resolve, reject) => {
        try {
            const assetblcs = this.assetBlcs;

            if (assetblcs.length) {
                const contains = containsObjectId(assetblcs, assetid);

                if (contains) {
                    const asstblc = await AssetBlc.findOne({ assetid, wallet: this.id });

                    AssetBlc.lock(asstblc._id, quantity);
                } else {
                    reject('insufficient funds')
                }
            }
        } catch (error) {

        }
    })
}

export default lockamount;