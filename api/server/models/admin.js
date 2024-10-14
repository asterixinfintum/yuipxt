const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    token: {
        type: String,
        unique: true
    },
    online: {
        type: Boolean,
        default: false,
    },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;