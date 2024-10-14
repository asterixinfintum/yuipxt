import Pair from '../models/pair';

async function setpairoutofview(pairid) {
    try {
        const tradingpair = await Pair.findOne({ _id: pairid });

        tradingpair.inview = false;
        await tradingpair.save();
    } catch (error) {
        throw error;
    }
}

export default setpairoutofview;