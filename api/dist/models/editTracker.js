"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var editTrackerSchema = new Schema({
  oldattributes: {},
  newattributes: {},
  clientEdited: {
    type: String,
    required: true
  },
  editedBy: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    "default": Date.now
  }
});
var EditTracker = mongoose.model('EditTracker', editTrackerSchema);
module.exports = EditTracker;