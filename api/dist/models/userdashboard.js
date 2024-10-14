"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userdashboardSchema = new Schema({
  autotrademarketstate: {
    type: String,
    required: true,
    "enum": ['profit', 'loss', 'neutral']
  },
  // Assuming it can be 'profit', 'loss', or 'neutral'
  autotrademarketpercentage: {
    type: Number,
    required: true
  },
  autotrademarketfigure: {
    type: Number,
    required: true
  },
  graphfigures: []
});
var UserDashboard = mongoose.model('UserDashboard', userdashboardSchema);
module.exports = UserDashboard;