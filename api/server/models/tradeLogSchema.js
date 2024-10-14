const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tradeLogSchema = new Schema({
    botId: { type: Schema.Types.ObjectId, ref: 'TradingBot', required: true }, // Reference to the TradingBot model
    timestamp: { type: Date, default: Date.now },
    assetPair: String,   // e.g., BTC/USD
    action: String,      // e.g., "BUY" or "SELL"
    price: Number,
    quantity: Number,
    totalValue: Number,
    fees: Number,
    notes: String
});

const TradeLog = mongoose.model('TradeLog', tradeLogSchema);

module.exports = { TradeLog };