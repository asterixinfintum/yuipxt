const mongoose = require('mongoose');
const { Schema } = mongoose;

const userdashboardSchema = new Schema({
    autotrademarketstate: { type: String, required: true, enum: ['profit', 'loss', 'neutral'] }, // Assuming it can be 'profit', 'loss', or 'neutral'
    autotrademarketpercentage: { type: Number, required: true },
    autotrademarketfigure: { type: Number, required: true },
    graphfigures: []
});

const UserDashboard = mongoose.model('UserDashboard', userdashboardSchema);

module.exports = UserDashboard;