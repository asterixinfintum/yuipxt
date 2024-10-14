const mongoose = require('mongoose');
const { Schema } = mongoose;

const editTrackerSchema = new Schema({
    oldattributes: {},
    newattributes: {},
    clientEdited: {
        type: String,
        required: true,
    },
    editedBy: {
        type: String,
        required: true
    },
    time: { type: Date, default: Date.now }
});

const EditTracker = mongoose.model('EditTracker', editTrackerSchema);

module.exports = EditTracker;