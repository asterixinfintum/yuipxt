const mongoose = require('mongoose');
const { Schema } = mongoose;

const allowedPairSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['crypto', 'stock', 'commodity'],
    },
    pairlabel: {
        type: String,
        required: true,
    },
    pair: {
        type: String,
        required: true,
    },
});

const AllowedPair = mongoose.model('AllowedPair', allowedPairSchema);

module.exports = AllowedPair;