const mongoose = require('mongoose');
const { Schema } = mongoose;

const tokenSchema = new Schema({
    unid: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true //agent, user
    },
    token: {
        type: String,
        required: true
    }
});

tokenSchema.statics.deleteToken = async function (token) {
    try {
        const result = await this.findOneAndDelete({ token: token });
        if (result) {
            return true; // Return true when the token is successfully deleted
        } else {
            return false; // Return false if the token is not found (not deleted)
        }
    } catch (error) {
        console.error('Error deleting token:', error);
        throw error; // Re-throw the error for the caller to handle
    }
};

tokenSchema.statics.deleteTokensByType = async function (type) {
    try {
        const result = await this.deleteMany({ type: type });
        return result; // This will return an object with the result of the deletion
    } catch (error) {
        console.error('Error deleting tokens by type:', error);
        throw error; // Re-throw the error for the caller to handle
    }
};

const TokenTracker = mongoose.model('TokenTracker', tokenSchema);

module.exports = TokenTracker;
