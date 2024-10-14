const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    assignedTo:  {
        type: Schema.Types.ObjectId
    },
    createdBy: {
        type: Schema.Types.ObjectId,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;