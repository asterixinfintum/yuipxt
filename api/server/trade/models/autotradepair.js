const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autoTradePairSchema = new Schema({
    tradingPair: {
        type: String,
        required: true
    }
});

autoTradePairSchema.statics.getpairs = async function () {
    const pairs = await this.find();
    return pairs.map(pair => pair.tradingPair);
}


const AutoTradePair = mongoose.model('AutoTradePair', autoTradePairSchema);

module.exports = AutoTradePair;