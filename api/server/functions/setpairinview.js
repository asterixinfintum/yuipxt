import Pair from '../models/pair';

async function setpairinview(pairid) {
    try {
        const tradingpair = await Pair.findOne({ _id: pairid });

        tradingpair.inview = true;
        await tradingpair.save();
    } catch (error) {
        throw error;
    }
}

export default setpairinview;