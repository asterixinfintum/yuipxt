"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var notificationSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId
  },
  createdBy: {
    type: Schema.Types.ObjectId
  },
  date: {
    type: Date,
    "default": Date.now
  }
});
var Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;