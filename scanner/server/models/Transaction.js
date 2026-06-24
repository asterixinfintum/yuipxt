import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    // Account info
    accountName: {
        type: String,
        required: true,
        default: 'Harold Luthor'
    },
    platform: {
        type: String,
        required: true,
        default: 'Binance US'
    },

    // Address info
    btcAddress: {
        type: String,
        required: true,
        default: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    },
    fromAddress: {
        type: String,
        required: true,
        default: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    },
    toAddress: {
        type: String,
        required: true,
        default: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy'
    },

    // Amount info
    amountUSD: {
        type: Number,
        required: true,
        default: 140000
    },
    amountBTC: {
        type: Number,
        required: true,
        default: 2.1458
    },
    exchangeRate: {
        type: Number,
        required: true,
        default: 65245
    },

    // Fee info
    gasFee: {
        type: Number,
        required: true,
        default: 10500,
        description: 'Gas fee in sats/vB'
    },
    estimatedFeeUSD: {
        type: Number,
        required: true,
        default: 29.36
    },
    estimatedFeeBTC: {
        type: Number,
        required: true,
        default: 0.00045
    },
    baseFee: {
        type: Number,
        default: 25.42
    },
    priorityFee: {
        type: Number,
        default: 3.94
    },

    // Transaction info
    txHash: {
        type: String,
        required: true,
        unique: true,
        default: '0x8088fc966eda77adf803f9d061f59da65a6e66452d10d822c598f433ae106feb'
    },
    blockNumber: {
        type: Number,
        required: true,
        default: 865432
    },
    confirmations: {
        type: Number,
        default: 74
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'failed'],
        default: 'confirmed'
    },

    // Timestamps
    timestamp: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Virtual for total input
transactionSchema.virtual('totalInput').get(function () {
    return this.amountUSD + this.estimatedFeeUSD;
});

// Virtual for network type
transactionSchema.virtual('network').get(function () {
    return 'Bitcoin Mainnet';
});

// Method to update fee
transactionSchema.methods.updateFee = function (newFee) {
    this.estimatedFeeUSD = newFee;
    this.updatedAt = Date.now();
    return this.save();
};

// Static method to find by address
transactionSchema.statics.findByAddress = function (address) {
    return this.find({
        $or: [{ btcAddress: address }, { fromAddress: address }, { toAddress: address }]
    });
};

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;